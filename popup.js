/* ================================================
   GitHub Repo Manager — popup.js
   ================================================ */

const API = 'https://api.github.com';

// ─── State ─────────────────────────────────────
let token = '';
let allRepos = [];
let selected = new Set();
let busyRepos = new Set(); // repos currently being processed

// ─── DOM ───────────────────────────────────────
const $  = id => document.getElementById(id);
const qs = (sel, el = document) => el.querySelector(sel);

// ─── Init icons ────────────────────────────────
function initIcons() {
  setIcon($('headerLogo'),      'github');
  setIcon($('settingsBtn'),     'settings');
  setIcon($('settingsKeyIcon'), 'key');
  setIcon($('extLinkIcon'),     'externalLink');
  setIcon($('toggleTokenBtn'),  'eye');
  setIcon($('clearTokenIcon'),  'trash2');
  setIcon($('searchIcon'),      'search');
  setIcon($('refreshBtn'),      'refreshCw');
  setIcon($('bulkPublicIcon'),  'globe');
  setIcon($('bulkPrivateIcon'), 'lock');
  setIcon($('bulkDeleteIcon'),  'trash2');
  setIcon($('bulkClearIcon'),   'x');
  setIcon($('footerGhIcon'),    'github');
}

// ─── GitHub API ─────────────────────────────────
async function ghFetch(path, opts = {}) {
  const res = await fetch(`${API}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...(opts.headers || {}),
    },
  });
  return res;
}

async function fetchAllRepos() {
  const repos = [];
  let page = 1;
  while (true) {
    const res = await ghFetch(
      `/user/repos?per_page=100&page=${page}&sort=updated&affiliation=owner`
    );
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      throw new Error(b.message || `HTTP ${res.status}`);
    }
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return repos;
}

async function validateToken(t) {
  const res = await fetch(`${API}/user`, {
    headers: { Authorization: `Bearer ${t}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error('Token không hợp lệ');
  return res.json();
}

// ─── Storage ────────────────────────────────────
const storage = {
  get: key => new Promise(r => chrome.storage.local.get([key], d => r(d[key] || ''))),
  set: (key, val) => new Promise(r => chrome.storage.local.set({ [key]: val }, r)),
};

// ─── Toast ──────────────────────────────────────
let _toastTimer;
function showToast(msg, type = 'default') {
  const el    = $('toast');
  const msgEl = $('toastMsg');
  const icEl  = $('toastIcon');
  msgEl.textContent = msg;

  el.className = el.className.replace(/border-\S+|text-\S+(?= )/g, '');
  const styles = {
    ok:      { border: 'border-gh-green',  text: 'text-gh-green',  ic: 'checkCircle' },
    err:     { border: 'border-gh-red',    text: 'text-gh-red',    ic: 'alertTriangle' },
    default: { border: 'border-gh-border2',text: 'text-gh-text',   ic: null },
  };
  const s = styles[type] || styles.default;
  el.classList.remove('hidden');
  el.classList.remove('border-gh-green','border-gh-red','border-gh-border2',
                       'text-gh-green','text-gh-red','text-gh-text');
  el.classList.add(s.border, s.text);
  if (s.ic) setIcon(icEl, s.ic); else icEl.innerHTML = '';

  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.add('hidden'), 3000);
}

// ─── Modal ───────────────────────────────────────
function showConfirm({ icon: iconName = 'alertTriangle', title, body,
                       needInput = false, inputPlaceholder = '', inputHint = '',
                       confirmLabel = 'Xác nhận', dangerous = true }) {
  return new Promise(resolve => {
    const overlay  = $('modalOverlay');
    const stripe   = $('modalStripe');
    const iconWrap = $('modalIconWrap');
    const titleEl  = $('modalTitle');
    const bodyEl   = $('modalBody');
    const inputWrap = $('modalInputWrap');
    const inputEl  = $('modalInput');
    const hintEl   = $('modalInputHint');
    const confirmBtn  = $('modalConfirm');
    const cancelBtn   = $('modalCancel');
    const autoFillBtn = $('autoFillBtn');

    // style
    if (dangerous) {
      stripe.className    = 'h-1 w-full bg-gh-red';
      iconWrap.className  = 'w-14 h-14 rounded-full flex items-center justify-center bg-gh-red-bg text-gh-red';
      confirmBtn.className = 'flex-1 text-sm py-2 rounded-lg font-semibold bg-gh-red text-white hover:bg-red-500 transition-colors';
    } else {
      stripe.className    = 'h-1 w-full bg-gh-accent';
      iconWrap.className  = 'w-14 h-14 rounded-full flex items-center justify-center bg-blue-950 text-gh-accent';
      confirmBtn.className = 'flex-1 text-sm py-2 rounded-lg font-semibold bg-gh-accent text-gh-bg hover:bg-gh-accent-hover transition-colors';
    }

    setIcon(iconWrap, iconName);
    titleEl.textContent = title;
    bodyEl.innerHTML    = body;
    confirmBtn.textContent = confirmLabel;

    if (needInput) {
      inputWrap.classList.remove('hidden');
      inputEl.value       = '';
      inputEl.placeholder = inputPlaceholder;
      hintEl.innerHTML    = inputHint;
      autoFillBtn.onclick = () => {
        inputEl.value = inputPlaceholder;
        inputEl.focus();
        // flash xanh nhẹ để báo đã điền
        inputEl.classList.add('border-gh-accent');
        setTimeout(() => inputEl.classList.remove('border-gh-accent'), 600);
      };
      setTimeout(() => inputEl.focus(), 80);
    } else {
      inputWrap.classList.add('hidden');
    }

    overlay.classList.remove('hidden');

    function cleanup(result) {
      overlay.classList.add('hidden');
      cancelBtn.removeEventListener('click', onCancel);
      confirmBtn.removeEventListener('click', onConfirm);
      overlay.removeEventListener('click', onOverlay);
      if (needInput) {
        inputEl.removeEventListener('keydown', onKey);
        autoFillBtn.onclick = null;
      }
      resolve(result);
    }

    const onCancel  = () => cleanup(false);
    const onConfirm = () => cleanup(needInput ? inputEl.value : true);
    const onOverlay = e => { if (e.target === overlay) cleanup(false); };
    const onKey     = e => { if (e.key === 'Enter') onConfirm(); if (e.key === 'Escape') onCancel(); };

    cancelBtn.addEventListener('click', onCancel);
    confirmBtn.addEventListener('click', onConfirm);
    overlay.addEventListener('click', onOverlay);
    if (needInput) inputEl.addEventListener('keydown', onKey);
  });
}

// ─── Global progress bar ─────────────────────────
function showGlobalProgress(label, current, total) {
  const wrap  = $('globalProgressWrap');
  const lbl   = $('globalProgressLabel');
  const cnt   = $('globalProgressCount');
  const fill  = $('globalProgressFill');
  wrap.classList.remove('hidden');
  lbl.textContent  = label;
  cnt.textContent  = `${current} / ${total}`;
  fill.style.width = `${Math.round((current / total) * 100)}%`;
}
function hideGlobalProgress() {
  $('globalProgressWrap').classList.add('hidden');
  $('globalProgressFill').style.width = '0%';
}

// ─── Repo card helpers ───────────────────────────
function esc(s) {
  return String(s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function repoCardHTML(r) {
  const isSel  = selected.has(r.full_name);
  const isBusy = busyRepos.has(r.full_name);
  const updated = new Date(r.updated_at).toLocaleDateString('vi-VN',
    { day:'2-digit', month:'2-digit', year:'numeric' });

  const visBadge = r.private
    ? `<span class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium
                    bg-gh-purple-bg text-gh-purple border border-gh-purple-border">
         ${icon('lock')} Private</span>`
    : `<span class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-medium
                    bg-gh-green-bg text-gh-green border border-gh-green-border">
         ${icon('globe')} Public</span>`;

  const forkBadge = r.fork
    ? `<span class="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full
                    bg-gh-bg3 text-gh-subtle border border-gh-border">
         ${icon('gitFork')} Fork</span>`
    : '';

  const descEl = r.description
    ? `<p class="text-[11px] text-gh-subtle mt-1 truncate" title="${esc(r.description)}">${esc(r.description)}</p>`
    : '';

  // Buttons when busy vs normal
  const visBtn = isBusy
    ? `<button disabled class="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg
               bg-gh-bg3 border border-gh-border text-gh-subtle cursor-not-allowed opacity-50">
         ${icon('loader2','animate-spin-fast')} ...</button>`
    : r.private
      ? `<button class="vis-btn flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg
               bg-gh-bg3 border border-gh-border text-gh-text hover:bg-gh-bg4 hover:border-gh-accent transition-colors"
               data-fn="${esc(r.full_name)}" data-private="true">
           ${icon('globe')} Public</button>`
      : `<button class="vis-btn flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg
               bg-gh-bg3 border border-gh-border text-gh-text hover:bg-gh-bg4 hover:border-gh-purple-border transition-colors"
               data-fn="${esc(r.full_name)}" data-private="false">
           ${icon('lock')} Private</button>`;

  const delBtn = isBusy
    ? `<button disabled class="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg
               bg-gh-red-bg border border-gh-red-border text-gh-red cursor-not-allowed opacity-50">
         ${icon('loader2','animate-spin-fast')}</button>`
    : `<button class="del-btn flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg
               bg-gh-bg3 border border-gh-border text-gh-muted hover:bg-gh-red-bg
               hover:border-gh-red-border hover:text-gh-red transition-colors"
               data-fn="${esc(r.full_name)}" title="Xóa repo">
         ${icon('trash2')}</button>`;

  const loadingOverlay = isBusy
    ? `<div class="absolute inset-0 rounded-xl bg-gh-bg/60 backdrop-blur-[1px] flex items-center justify-center z-10">
         <div class="flex items-center gap-2 text-xs text-gh-accent bg-gh-bg3 border border-gh-border rounded-full px-3 py-1.5">
           ${icon('loader2','animate-spin-fast')} Đang xử lý...
         </div>
       </div>`
    : '';

  return `<div class="repo-item relative flex items-center gap-2.5 p-2.5 rounded-xl
                       border transition-all duration-150 group
                       ${isSel
                         ? 'bg-blue-950/30 border-gh-accent/60'
                         : 'bg-gh-bg2 border-gh-border hover:border-gh-border2 hover:bg-[#1a1f27]'}"
               data-fn="${esc(r.full_name)}">
    ${loadingOverlay}

    <!-- checkbox -->
    <label class="flex items-center shrink-0 cursor-pointer pl-0.5">
      <input type="checkbox" class="repo-cb w-3.5 h-3.5" data-fn="${esc(r.full_name)}" ${isSel ? 'checked' : ''} />
    </label>

    <!-- info -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1.5 flex-wrap">
        <a href="${esc(r.html_url)}" target="_blank"
           class="font-semibold text-sm text-gh-accent hover:text-gh-accent-hover hover:underline
                  truncate max-w-[180px]" title="${esc(r.full_name)}">
          ${esc(r.name)}
        </a>
        ${visBadge}${forkBadge}
      </div>
      ${descEl}
      <div class="flex items-center gap-2.5 mt-1 text-[11px] text-gh-subtle">
        <span class="flex items-center gap-1">${icon('star')} ${r.stargazers_count}</span>
        <span class="text-gh-bg3">·</span>
        <span>${updated}</span>
        ${r.fork ? `<span class="text-gh-bg3">·</span><span class="flex items-center gap-1">${icon('gitFork')} ${esc(r.source?.full_name || 'fork')}</span>` : ''}
      </div>
    </div>

    <!-- actions -->
    <div class="flex items-center gap-1.5 shrink-0 ml-1">
      ${visBtn}
      ${delBtn}
    </div>
  </div>`;
}

// ─── Render ──────────────────────────────────────
function getFiltered() {
  const q    = $('searchInput').value.toLowerCase();
  const vis  = $('visFilter').value;
  const sort = $('sortFilter').value;

  let repos = allRepos.filter(r => {
    const mQ = r.name.toLowerCase().includes(q) || (r.description||'').toLowerCase().includes(q);
    const mV = vis === 'all' ||
      (vis === 'public'  && !r.private) ||
      (vis === 'private' && r.private);
    return mQ && mV;
  });

  if (sort === 'name')  repos.sort((a,b) => a.name.localeCompare(b.name));
  if (sort === 'stars') repos.sort((a,b) => b.stargazers_count - a.stargazers_count);
  return repos;
}

function renderRepos() {
  const repos = getFiltered();
  $('statsLabel').textContent = `${repos.length} / ${allRepos.length} repos`;

  if (repos.length === 0) {
    $('repoList').innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-gh-subtle">
        <span class="mb-3 text-gh-bg4">${icon('search')}</span>
        <p class="text-sm">${allRepos.length > 0 ? 'Không tìm thấy repo nào' : 'Nhập token để bắt đầu'}</p>
      </div>`;
    return;
  }

  $('repoList').innerHTML = repos.map(repoCardHTML).join('');

  // bind events
  $('repoList').querySelectorAll('.repo-cb').forEach(cb =>
    cb.addEventListener('change', () => toggleSelect(cb.dataset.fn))
  );
  $('repoList').querySelectorAll('.vis-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      changeVisibility(btn.dataset.fn, btn.dataset.private === 'true');
    })
  );
  $('repoList').querySelectorAll('.del-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteRepo(btn.dataset.fn);
    })
  );
}

// Re-render only one card (faster than full re-render)
function refreshCard(fullName) {
  const el = $('repoList').querySelector(`[data-fn="${CSS.escape(fullName)}"]`);
  if (!el) return;
  const r = allRepos.find(x => x.full_name === fullName);
  if (!r) { el.remove(); return; }
  const tmp = document.createElement('div');
  tmp.innerHTML = repoCardHTML(r);
  const newEl = tmp.firstElementChild;
  el.replaceWith(newEl);

  // rebind events on new card
  newEl.querySelectorAll('.repo-cb').forEach(cb =>
    cb.addEventListener('change', () => toggleSelect(cb.dataset.fn))
  );
  newEl.querySelectorAll('.vis-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      changeVisibility(btn.dataset.fn, btn.dataset.private === 'true');
    })
  );
  newEl.querySelectorAll('.del-btn').forEach(btn =>
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteRepo(btn.dataset.fn);
    })
  );
}

// ─── Bulk bar ────────────────────────────────────
function toggleSelect(fn) {
  selected.has(fn) ? selected.delete(fn) : selected.add(fn);
  updateBulkBar();
  const card = $('repoList').querySelector(`[data-fn="${CSS.escape(fn)}"]`);
  if (!card) return;
  const cb = card.querySelector('.repo-cb');
  if (cb) cb.checked = selected.has(fn);
  if (selected.has(fn)) {
    card.classList.replace('bg-gh-bg2','bg-blue-950/30');
    card.classList.replace('border-gh-border','border-gh-accent/60');
  } else {
    card.classList.replace('bg-blue-950/30','bg-gh-bg2');
    card.classList.replace('border-gh-accent/60','border-gh-border');
  }
}

function updateBulkBar() {
  const bar = $('bulkBar');
  if (selected.size > 0) {
    bar.classList.remove('hidden');
    bar.classList.add('flex');
    $('bulkCount').textContent = `${selected.size} đã chọn`;
  } else {
    bar.classList.add('hidden');
    bar.classList.remove('flex');
  }
}

// ─── Loading skeletons ───────────────────────────
function showSkeletons(n = 5) {
  $('repoList').innerHTML = Array(n).fill(0).map(() => `
    <div class="flex items-center gap-3 p-3 rounded-xl bg-gh-bg2 border border-gh-border">
      <div class="skeleton w-3.5 h-3.5 rounded shrink-0"></div>
      <div class="flex-1 space-y-2">
        <div class="skeleton h-3.5 w-36 rounded"></div>
        <div class="skeleton h-2.5 w-56 rounded"></div>
        <div class="skeleton h-2 w-24 rounded"></div>
      </div>
      <div class="flex gap-1.5">
        <div class="skeleton h-7 w-16 rounded-lg"></div>
        <div class="skeleton h-7 w-8 rounded-lg"></div>
      </div>
    </div>`).join('');
}

// ─── Load repos ───────────────────────────────────
async function loadRepos() {
  if (!token) {
    $('repoList').innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-gh-subtle">
        <span class="mb-3 opacity-30">${icon('key')}</span>
        <p class="text-sm">Nhập GitHub Token để bắt đầu</p>
      </div>`;
    return;
  }
  showSkeletons();
  $('statsLabel').textContent = '';
  try {
    allRepos = await fetchAllRepos();
    selected.clear();
    updateBulkBar();
    renderRepos();
    showToast(`Đã tải ${allRepos.length} repos`, 'ok');
  } catch (err) {
    $('repoList').innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-gh-red">
        <p class="text-sm font-medium">${esc(err.message)}</p>
      </div>`;
    showToast(err.message, 'err');
  }
}

// ─── Change visibility ────────────────────────────
async function changeVisibility(fullName, isCurrentlyPrivate) {
  if (busyRepos.has(fullName)) return;
  const makePrivate = !isCurrentlyPrivate;
  const label = makePrivate ? 'Private' : 'Public';
  const [owner, repo] = fullName.split('/');

  const ok = await showConfirm({
    icon: makePrivate ? 'lock' : 'globe',
    title: `Đổi thành ${label}`,
    body: `Repo <strong class="text-gh-text">${esc(fullName)}</strong> sẽ được đổi thành <strong>${label}</strong>.`,
    confirmLabel: `Đổi thành ${label}`,
    dangerous: false,
  });
  if (!ok) return;

  busyRepos.add(fullName);
  refreshCard(fullName);

  try {
    const res = await ghFetch(`/repos/${owner}/${repo}`, {
      method: 'PATCH',
      body: JSON.stringify({ private: makePrivate }),
    });
    if (!res.ok) {
      const b = await res.json().catch(() => ({}));
      throw new Error(b.message || `HTTP ${res.status}`);
    }
    const updated = await res.json();
    const idx = allRepos.findIndex(r => r.full_name === fullName);
    if (idx !== -1) allRepos[idx] = updated;
    showToast(`${repo} → ${label}`, 'ok');
  } catch (err) {
    showToast(err.message, 'err');
  } finally {
    busyRepos.delete(fullName);
    refreshCard(fullName);
  }
}

// ─── Delete repo ──────────────────────────────────
async function deleteRepo(fullName) {
  if (busyRepos.has(fullName)) return;
  const [owner, repo] = fullName.split('/');

  const typed = await showConfirm({
    icon: 'shieldAlert',
    title: 'Xóa repo vĩnh viễn',
    body: `Hành động này <strong class="text-gh-red">KHÔNG THỂ HOÀN TÁC</strong>.<br/>
           Tất cả code, issues, PRs sẽ mất.`,
    needInput: true,
    inputHint: `Gõ <code class="text-gh-red bg-gh-red-bg px-1 rounded">${esc(repo)}</code> để xác nhận`,
    inputPlaceholder: repo,
    confirmLabel: 'Xóa vĩnh viễn',
    dangerous: true,
  });

  if (typed === false) return;
  if (typed !== repo) {
    showToast('Tên không khớp — đã hủy', 'err');
    return;
  }

  busyRepos.add(fullName);
  refreshCard(fullName);

  try {
    const res = await ghFetch(`/repos/${owner}/${repo}`, { method: 'DELETE' });
    if (res.status !== 204) {
      const b = await res.json().catch(() => ({}));
      throw new Error(b.message || `HTTP ${res.status}`);
    }
    allRepos = allRepos.filter(r => r.full_name !== fullName);
    selected.delete(fullName);
    busyRepos.delete(fullName);
    updateBulkBar();
    // Animate card out
    const el = $('repoList').querySelector(`[data-fn="${CSS.escape(fullName)}"]`);
    if (el) {
      el.style.transition = 'opacity 0.25s, transform 0.25s';
      el.style.opacity = '0';
      el.style.transform = 'translateX(20px)';
      setTimeout(() => el.remove(), 260);
    }
    $('statsLabel').textContent = `${getFiltered().length} / ${allRepos.length} repos`;
    showToast(`Đã xóa ${repo}`, 'ok');
  } catch (err) {
    busyRepos.delete(fullName);
    refreshCard(fullName);
    showToast(err.message, 'err');
  }
}

// ─── Bulk change visibility ───────────────────────
async function bulkChangeVisibility(makePrivate) {
  const label = makePrivate ? 'Private' : 'Public';
  const fns   = [...selected];
  const ok    = await showConfirm({
    icon: makePrivate ? 'lock' : 'globe',
    title: `Đổi ${fns.length} repos → ${label}`,
    body: `<strong class="text-gh-text">${fns.length} repos</strong> sẽ được đổi thành <strong>${label}</strong>.`,
    confirmLabel: `Đổi ${fns.length} repos`,
    dangerous: false,
  });
  if (!ok) return;

  let done = 0, failed = 0;
  for (const fn of fns) {
    busyRepos.add(fn);
    refreshCard(fn);
  }

  for (const fn of fns) {
    const [owner, repo] = fn.split('/');
    showGlobalProgress(`Đổi thành ${label}...`, done + failed + 1, fns.length);
    try {
      const res = await ghFetch(`/repos/${owner}/${repo}`, {
        method: 'PATCH',
        body: JSON.stringify({ private: makePrivate }),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      const idx = allRepos.findIndex(r => r.full_name === fn);
      if (idx !== -1) allRepos[idx] = updated;
      done++;
    } catch {
      failed++;
    }
    busyRepos.delete(fn);
    refreshCard(fn);
    showGlobalProgress(`Đổi thành ${label}...`, done + failed, fns.length);
  }

  hideGlobalProgress();
  selected.clear();
  updateBulkBar();
  showToast(`${done} thành công${failed ? `, ${failed} lỗi` : ''}`, failed ? 'err' : 'ok');
}

// ─── Bulk delete ──────────────────────────────────
async function bulkDelete() {
  const fns   = [...selected];
  const typed = await showConfirm({
    icon: 'shieldAlert',
    title: `Xóa ${fns.length} repos`,
    body: `<strong class="text-gh-red">KHÔNG THỂ HOÀN TÁC!</strong><br/>
           Toàn bộ code, issues, PRs sẽ mất.`,
    needInput: true,
    inputHint: `Gõ <code class="text-gh-red bg-gh-red-bg px-1 rounded">DELETE ${fns.length}</code> để xác nhận`,
    inputPlaceholder: `DELETE ${fns.length}`,
    confirmLabel: `Xóa ${fns.length} repos`,
    dangerous: true,
  });
  if (typed === false) return;
  if (typed !== `DELETE ${fns.length}`) {
    showToast('Xác nhận không đúng — đã hủy', 'err');
    return;
  }

  let done = 0, failed = 0;
  for (const fn of fns) {
    busyRepos.add(fn);
    refreshCard(fn);
  }

  for (const fn of fns) {
    const [owner, repo] = fn.split('/');
    showGlobalProgress('Đang xóa repos...', done + failed + 1, fns.length);
    try {
      const res = await ghFetch(`/repos/${owner}/${repo}`, { method: 'DELETE' });
      if (res.status !== 204) throw new Error();
      allRepos = allRepos.filter(r => r.full_name !== fn);
      selected.delete(fn);
      busyRepos.delete(fn);
      // animate out
      const el = $('repoList').querySelector(`[data-fn="${CSS.escape(fn)}"]`);
      if (el) {
        el.style.transition = 'opacity 0.2s, transform 0.2s';
        el.style.opacity = '0';
        el.style.transform = 'translateX(20px)';
        setTimeout(() => el.remove(), 220);
      }
      done++;
    } catch {
      failed++;
      busyRepos.delete(fn);
      refreshCard(fn);
    }
    showGlobalProgress('Đang xóa repos...', done + failed, fns.length);
  }

  await new Promise(r => setTimeout(r, 300));
  hideGlobalProgress();
  updateBulkBar();
  $('statsLabel').textContent = `${getFiltered().length} / ${allRepos.length} repos`;
  showToast(`Đã xóa ${done}${failed ? `, ${failed} lỗi` : ''}`, failed ? 'err' : 'ok');
}

// ─── Settings panel ────────────────────────────────
$('settingsBtn').addEventListener('click', () => {
  const panel  = $('settingsPanel');
  const isOpen = !panel.classList.contains('hidden');
  panel.classList.toggle('hidden', isOpen);
  $('settingsBtn').classList.toggle('text-gh-accent', !isOpen);
  if (!isOpen && token) $('tokenInput').value = token;
});

$('toggleTokenBtn').addEventListener('click', () => {
  const inp = $('tokenInput');
  const isPass = inp.type === 'password';
  inp.type = isPass ? 'text' : 'password';
  setIcon($('toggleTokenBtn'), isPass ? 'eyeOff' : 'eye');
});

$('saveTokenBtn').addEventListener('click', async () => {
  const t = $('tokenInput').value.trim();
  if (!t) { showToast('Nhập token trước', 'err'); return; }

  const btn = $('saveTokenBtn');
  btn.disabled = true;
  btn.innerHTML = `${icon('loader2','animate-spin-fast inline-block mr-1')} Xác thực...`;

  const statusEl = $('tokenStatus');
  statusEl.className = 'hidden text-xs px-3 py-2 rounded-lg font-medium';

  try {
    const user = await validateToken(t);
    token = t;
    await storage.set('ghToken', t);

    // Show user badge in header
    const badge = $('userBadge');
    badge.innerHTML = `${icon('users','inline-block')} @${esc(user.login)}`;
    badge.classList.remove('hidden');
    badge.classList.add('flex');

    statusEl.textContent = `Xác thực thành công: @${user.login}`;
    statusEl.className = 'text-xs px-3 py-2 rounded-lg font-medium bg-gh-green-bg text-gh-green border border-gh-green-border';

    setTimeout(() => {
      $('settingsPanel').classList.add('hidden');
      $('settingsBtn').classList.remove('text-gh-accent');
      loadRepos();
    }, 900);
  } catch (err) {
    statusEl.textContent = err.message;
    statusEl.className = 'text-xs px-3 py-2 rounded-lg font-medium bg-gh-red-bg text-gh-red border border-gh-red-border';
    showToast('Token không hợp lệ', 'err');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Lưu';
  }
});

$('clearTokenBtn').addEventListener('click', async () => {
  token = '';
  allRepos = [];
  selected.clear();
  $('tokenInput').value = '';
  await storage.set('ghToken', '');
  $('userBadge').classList.add('hidden');
  $('userBadge').classList.remove('flex');
  updateBulkBar();
  renderRepos();
  showToast('Đã xóa token', 'ok');
});

// ─── Toolbar events ────────────────────────────────
$('refreshBtn').addEventListener('click', loadRepos);
$('searchInput').addEventListener('input', renderRepos);
$('visFilter').addEventListener('change', renderRepos);
$('sortFilter').addEventListener('change', renderRepos);

// ─── Bulk events ───────────────────────────────────
$('bulkPublicBtn').addEventListener('click',  () => bulkChangeVisibility(false));
$('bulkPrivateBtn').addEventListener('click', () => bulkChangeVisibility(true));
$('bulkDeleteBtn').addEventListener('click',  bulkDelete);
$('bulkClearBtn').addEventListener('click', () => {
  selected.clear();
  updateBulkBar();
  renderRepos();
});

// ─── Init ──────────────────────────────────────────
(async () => {
  initIcons();
  token = await storage.get('ghToken');

  if (token) {
    $('tokenInput').value = token;
    try {
      const user = await validateToken(token);
      const badge = $('userBadge');
      badge.innerHTML = `${icon('users','inline-block')} @${esc(user.login)}`;
      badge.classList.remove('hidden');
      badge.classList.add('flex');
      loadRepos();
    } catch {
      token = '';
      $('settingsPanel').classList.remove('hidden');
      $('settingsBtn').classList.add('text-gh-accent');
      renderRepos();
    }
  } else {
    $('settingsPanel').classList.remove('hidden');
    $('settingsBtn').classList.add('text-gh-accent');
    renderRepos();
  }
})();
