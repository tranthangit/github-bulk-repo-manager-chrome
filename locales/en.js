/* ================================================
   GitHub Repo Manager — English locale (en)
   ================================================
   To contribute a new language, see CONTRIBUTING.md
   ================================================ */

window.LOCALES = window.LOCALES || {};
window.LOCALES.en = {

  /* ── Date locale ── */
  dateLocale: 'en-US',

  /* ── Settings panel ── */
  tokenPermDescHTML:
    'Requires <code class="bg-gh-bg3 text-gh-accent px-1 py-0.5 rounded text-[11px]">repo</code>' +
    ' and <code class="bg-gh-bg3 text-gh-accent px-1 py-0.5 rounded text-[11px]">delete_repo</code> scopes.' +
    ' <a href="https://github.com/settings/tokens" target="_blank"' +
    '    class="text-gh-accent hover:underline ml-1 inline-flex items-center gap-0.5">' +
    '  Create token <span id="extLinkIcon"></span></a>',
  save:             'Save',
  clearToken:       'Clear saved token',
  autoFill:         'Auto-fill',
  autoFillTitle:    'Auto-fill',

  /* ── Progress bar ── */
  processing:       'Processing...',

  /* ── Toolbar ── */
  searchPlaceholder: 'Search name or description...',
  filterAll:        'All',
  sortUpdated:      'Recently updated',
  sortName:         'Name A→Z',
  sortStars:        'Most starred',

  /* ── Bulk action bar ── */
  bulkPublicBtn:    'Make Public',
  bulkPrivateBtn:   'Make Private',
  bulkDeleteBtn:    'Delete all',

  /* ── Modal ── */
  cancel:           'Cancel',
  confirm:          'Confirm',
  deleteRepoTitle:  'Delete repo',

  /* ── Token messages ── */
  invalidToken:     'Invalid token',
  enterTokenFirst:  'Enter token first',
  validating:       'Validating...',
  authSuccess:      'Authenticated: @{0}',
  tokenCleared:     'Token cleared',

  /* ── Repo list ── */
  loadedRepos:      'Loaded {0} repos',
  noReposFound:     'No repos found',
  enterTokenPrompt: 'Enter GitHub Token to get started',
  processingLabel:  'Processing...',

  /* ── Change visibility ── */
  changeToTitle:    'Change to {0}',
  changeToBody:     'Repo <strong class="text-gh-text">{0}</strong> will be changed to <strong>{1}</strong>.',
  changeToConfirm:  'Change to {0}',
  changingTo:       'Changing to {0}...',
  changedRepo:      '{0} → {1}',

  /* ── Delete repo ── */
  deleteRepoPermanentTitle: 'Delete repo permanently',
  deleteRepoBody:   'This action <strong class="text-gh-red">CANNOT BE UNDONE</strong>.<br/>All code, issues, and PRs will be lost.',
  typeToConfirm:    'Type <code class="text-gh-red bg-gh-red-bg px-1 rounded">{0}</code> to confirm',
  deletePermanent:  'Delete permanently',
  deletedRepo:      'Deleted {0}',
  nameMismatch:     'Name mismatch — cancelled',

  /* ── Bulk change visibility ── */
  bulkChangeTitle:   'Change {0} repos → {1}',
  bulkChangeBody:    '<strong class="text-gh-text">{0} repos</strong> will be changed to <strong>{1}</strong>.',
  bulkChangeConfirm: 'Change {0} repos',
  bulkChanging:      'Changing to {0}...',
  succeeded:         'succeeded',
  failed:            'failed',

  /* ── Bulk delete ── */
  bulkDeleteTitle:   'Delete {0} repos',
  bulkDeleteBody:    '<strong class="text-gh-red">CANNOT BE UNDONE!</strong><br/>All code, issues, and PRs will be lost.',
  bulkDeleteHint:    'Type <code class="text-gh-red bg-gh-red-bg px-1 rounded">DELETE {0}</code> to confirm',
  bulkDeleteConfirm: 'Delete {0} repos',
  deletingRepos:     'Deleting repos...',
  deletedCount:      'Deleted {0}',
  confirmMismatch:   'Confirmation incorrect — cancelled',

  /* ── Content script ── */
  closePanel: 'Close',
};
