/* ================================================
   GitHub Repo Manager — Vietnamese locale (vi)
   ================================================
   Để đóng góp ngôn ngữ mới, xem CONTRIBUTING.md
   ================================================ */

window.LOCALES = window.LOCALES || {};
window.LOCALES.vi = {

  /* ── Date locale ── */
  dateLocale: 'vi-VN',

  /* ── Settings panel ── */
  tokenPermDescHTML:
    'Cần quyền <code class="bg-gh-bg3 text-gh-accent px-1 py-0.5 rounded text-[11px]">repo</code>' +
    ' và <code class="bg-gh-bg3 text-gh-accent px-1 py-0.5 rounded text-[11px]">delete_repo</code>.' +
    ' <a href="https://github.com/settings/tokens" target="_blank"' +
    '    class="text-gh-accent hover:underline ml-1 inline-flex items-center gap-0.5">' +
    '  Tạo token <span id="extLinkIcon"></span></a>',
  save:             'Lưu',
  clearToken:       'Xóa token đã lưu',
  autoFill:         'Tự điền',
  autoFillTitle:    'Tự động điền',

  /* ── Progress bar ── */
  processing:       'Đang xử lý...',

  /* ── Toolbar ── */
  searchPlaceholder: 'Tìm tên hoặc mô tả...',
  filterAll:        'Tất cả',
  sortUpdated:      'Mới cập nhật',
  sortName:         'Tên A→Z',
  sortStars:        'Nhiều sao nhất',

  /* ── Bulk action bar ── */
  bulkPublicBtn:    'Đổi Public',
  bulkPrivateBtn:   'Đổi Private',
  bulkDeleteBtn:    'Xóa tất cả',

  /* ── Modal ── */
  cancel:           'Hủy',
  confirm:          'Xác nhận',
  deleteRepoTitle:  'Xóa repo',

  /* ── Token messages ── */
  invalidToken:     'Token không hợp lệ',
  enterTokenFirst:  'Nhập token trước',
  validating:       'Xác thực...',
  authSuccess:      'Xác thực thành công: @{0}',
  tokenCleared:     'Đã xóa token',

  /* ── Repo list ── */
  loadedRepos:      'Đã tải {0} repos',
  noReposFound:     'Không tìm thấy repo nào',
  enterTokenPrompt: 'Nhập GitHub Token để bắt đầu',
  processingLabel:  'Đang xử lý...',

  /* ── Change visibility ── */
  changeToTitle:    'Đổi thành {0}',
  changeToBody:     'Repo <strong class="text-gh-text">{0}</strong> sẽ được đổi thành <strong>{1}</strong>.',
  changeToConfirm:  'Đổi thành {0}',
  changingTo:       'Đổi thành {0}...',
  changedRepo:      '{0} → {1}',

  /* ── Delete repo ── */
  deleteRepoPermanentTitle: 'Xóa repo vĩnh viễn',
  deleteRepoBody:   'Hành động này <strong class="text-gh-red">KHÔNG THỂ HOÀN TÁC</strong>.<br/>Tất cả code, issues, PRs sẽ mất.',
  typeToConfirm:    'Gõ <code class="text-gh-red bg-gh-red-bg px-1 rounded">{0}</code> để xác nhận',
  deletePermanent:  'Xóa vĩnh viễn',
  deletedRepo:      'Đã xóa {0}',
  nameMismatch:     'Tên không khớp — đã hủy',

  /* ── Bulk change visibility ── */
  bulkChangeTitle:   'Đổi {0} repos → {1}',
  bulkChangeBody:    '<strong class="text-gh-text">{0} repos</strong> sẽ được đổi thành <strong>{1}</strong>.',
  bulkChangeConfirm: 'Đổi {0} repos',
  bulkChanging:      'Đổi thành {0}...',
  succeeded:         'thành công',
  failed:            'lỗi',

  /* ── Bulk delete ── */
  bulkDeleteTitle:   'Xóa {0} repos',
  bulkDeleteBody:    '<strong class="text-gh-red">KHÔNG THỂ HOÀN TÁC!</strong><br/>Toàn bộ code, issues, PRs sẽ mất.',
  bulkDeleteHint:    'Gõ <code class="text-gh-red bg-gh-red-bg px-1 rounded">DELETE {0}</code> để xác nhận',
  bulkDeleteConfirm: 'Xóa {0} repos',
  deletingRepos:     'Đang xóa repos...',
  deletedCount:      'Đã xóa {0}',
  confirmMismatch:   'Xác nhận không đúng — đã hủy',

  /* ── Content script ── */
  closePanel: 'Đóng',
};
