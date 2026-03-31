/* ================================================
   GitHub Repo Manager — content.js
   Floating launcher button + slide-in panel
   ================================================ */

(function () {
  if (document.getElementById('ghm-root')) return;

  const ICON_URL  = chrome.runtime.getURL('icons/icon48.png');
  const POPUP_URL = chrome.runtime.getURL('popup.html');

  /* ── Root host (isolates from page styles) ── */
  const host = document.createElement('div');
  host.id = 'ghm-root';
  host.style.cssText = 'position:fixed;top:0;left:0;z-index:2147483647;';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'closed' });

  /* ── Styles ── */
  const style = document.createElement('style');
  style.textContent = `
    *,*::before,*::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── FAB button ── */
    #fab {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 10px 0 0 10px;
      background: #161b22;
      border: 1px solid #30363d;
      border-right: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: -2px 0 12px rgba(0,0,0,0.5);
      transition: width 0.2s ease, background 0.15s, box-shadow 0.2s;
      overflow: hidden;
    }
    #fab:hover {
      width: 52px;
      background: #1c2128;
      box-shadow: -4px 0 20px rgba(88,166,255,0.15);
    }
    #fab img {
      width: 26px;
      height: 26px;
      border-radius: 4px;
      flex-shrink: 0;
      pointer-events: none;
    }
    /* pulse ring on first open hint */
    #fab.pulse::after {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 14px 0 0 14px;
      border: 2px solid #58a6ff;
      animation: pulseRing 1.6s ease-out 3;
    }
    @keyframes pulseRing {
      0%   { opacity: 0.8; transform: scale(1); }
      100% { opacity: 0;   transform: scale(1.25); }
    }

    /* ── Panel backdrop ── */
    #backdrop {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      backdrop-filter: blur(2px);
      -webkit-backdrop-filter: blur(2px);
      animation: fadeIn 0.2s ease;
    }
    #backdrop.open { display: block; }
    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }

    /* ── Slide panel ── */
    #panel {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translate(100%, -50%);
      width: 480px;
      height: 640px;
      max-height: 96vh;
      border-radius: 16px 0 0 16px;
      background: #0d1117;
      border: 1px solid #30363d;
      border-right: none;
      box-shadow: -8px 0 40px rgba(0,0,0,0.7);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      transition: transform 0.28s cubic-bezier(0.34, 1.1, 0.64, 1);
    }
    #panel.open {
      transform: translate(0, -50%);
    }

    /* ── Panel header ── */
    #panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px 8px 14px;
      background: #161b22;
      border-bottom: 1px solid #30363d;
      flex-shrink: 0;
    }
    #panel-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 13px;
      font-weight: 600;
      color: #e6edf3;
    }
    #panel-title img {
      width: 20px;
      height: 20px;
      border-radius: 4px;
    }

    #close-btn {
      width: 28px;
      height: 28px;
      border: none;
      background: transparent;
      border-radius: 6px;
      cursor: pointer;
      color: #8b949e;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s, color 0.15s;
    }
    #close-btn:hover {
      background: #21262d;
      color: #e6edf3;
    }
    #close-btn svg { pointer-events: none; }

    /* ── Iframe ── */
    #popup-frame {
      flex: 1;
      width: 100%;
      border: none;
      background: #0d1117;
    }
  `;
  shadow.appendChild(style);

  /* ── FAB ── */
  const fab = document.createElement('button');
  fab.id = 'fab';
  fab.title = 'GitHub Repo Manager';
  fab.innerHTML = `<img src="${ICON_URL}" alt="GRM" />`;
  shadow.appendChild(fab);

  /* ── Backdrop ── */
  const backdrop = document.createElement('div');
  backdrop.id = 'backdrop';
  shadow.appendChild(backdrop);

  /* ── Panel ── */
  const panel = document.createElement('div');
  panel.id = 'panel';
  panel.innerHTML = `
    <div id="panel-header">
      <div id="panel-title">
        <img src="${ICON_URL}" alt="" />
        GitHub Repo Manager
      </div>
      <button id="close-btn" title="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
             viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
        </svg>
      </button>
    </div>
    <iframe id="popup-frame" src="${POPUP_URL}"></iframe>
  `;
  shadow.appendChild(panel);

  /* ── Localize close button ── */
  chrome.storage.local.get(['ghm_lang'], r => {
    const closeBtn = panel.querySelector('#close-btn');
    if (closeBtn) closeBtn.title = r.ghm_lang === 'vi' ? 'Đóng' : 'Close';
  });

  /* ── Pulse on first visit ── */
  chrome.storage.local.get(['ghm_launched'], r => {
    if (!r.ghm_launched) {
      fab.classList.add('pulse');
      setTimeout(() => fab.classList.remove('pulse'), 5000);
    }
  });

  /* ── Toggle logic ── */
  let isOpen = false;

  function open() {
    isOpen = true;
    panel.classList.add('open');
    backdrop.classList.add('open');
    chrome.storage.local.set({ ghm_launched: true });
    fab.classList.remove('pulse');
  }

  function close() {
    isOpen = false;
    panel.classList.remove('open');
    backdrop.classList.remove('open');
  }

  fab.addEventListener('click', () => isOpen ? close() : open());
  backdrop.addEventListener('click', close);

  const closeBtn = panel.querySelector('#close-btn');
  closeBtn.addEventListener('click', close);

  /* ── Keyboard: Escape to close ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && isOpen) close();
  });
})();
