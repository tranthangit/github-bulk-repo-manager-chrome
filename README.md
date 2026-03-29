# GitHub Repo Manager

> Chrome Extension — Quản lý GitHub repositories trực tiếp từ trình duyệt.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Manifest](https://img.shields.io/badge/manifest-v3-green.svg)
![Tailwind](https://img.shields.io/badge/tailwindcss-v3-38bdf8.svg)

---

## Tính năng

- **Xem tất cả repos** — Load toàn bộ repositories của tài khoản (phân trang tự động)
- **Đổi trạng thái** — Chuyển repo giữa Public / Private với progress indicator
- **Xóa repo** — Xác nhận bằng cách gõ tên repo, animation fade-out khi xóa
- **Bulk actions** — Chọn nhiều repo cùng lúc, đổi trạng thái hoặc xóa hàng loạt với progress bar
- **Tìm kiếm & lọc** — Theo tên, mô tả, visibility, sắp xếp theo ngày / tên / stars
- **Token bảo mật** — Lưu trong `chrome.storage.local`, không gửi đi đâu ngoài GitHub API

---

## Cài đặt

### Tải về & Load thủ công

1. Clone hoặc tải ZIP repo này về máy
2. Mở Chrome → địa chỉ `chrome://extensions/`
3. Bật **Developer mode** (góc trên bên phải)
4. Nhấn **Load unpacked** → chọn thư mục `github-repo-manager-chrome`

> **Lưu ý:** Nếu bạn chỉnh sửa code, chạy lại `npm run build` để rebuild CSS trước khi reload.

---

## Thiết lập Token

1. Truy cập [github.com/settings/tokens](https://github.com/settings/tokens)
2. Nhấn **Generate new token (classic)**
3. Đặt tên, chọn expiration phù hợp
4. Tick các quyền sau:

   | Quyền | Lý do |
   |---|---|
   | `repo` | Đọc danh sách và cập nhật visibility repo |
   | `delete_repo` | Xóa repo |

5. Copy token → dán vào ô token trong extension → nhấn **Lưu**

---

## Build từ source

```bash
# Cài dependencies
npm install

# Build Tailwind CSS (bắt buộc sau khi clone)
npm run build

# Hoặc watch mode (tự rebuild khi sửa file)
npm run watch
```

---

## Cấu trúc thư mục

```
github-repo-manager-chrome/
├── manifest.json          # Chrome Extension Manifest V3
├── popup.html             # UI chính
├── popup.js               # Logic + GitHub API calls
├── icons.js               # Lucide SVG icons (inline)
├── background.js          # Service worker
├── src/
│   └── input.css          # Tailwind CSS directives
├── dist/
│   └── tailwind.css       # CSS đã compiled (do npm run build tạo ra)
├── tailwind.config.js     # Tailwind config với GitHub dark theme colors
├── icons/
│   ├── icon.png           # Icon gốc
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── LICENSE
└── README.md
```

---

## Stack

| Thành phần | Chi tiết |
|---|---|
| **UI framework** | [Tailwind CSS v3](https://tailwindcss.com) |
| **Icons** | [Lucide](https://lucide.dev) (inline SVG, không cần CDN) |
| **API** | [GitHub REST API v3](https://docs.github.com/en/rest) |
| **Storage** | `chrome.storage.local` |
| **Manifest** | Chrome Extension Manifest V3 |

---

## Lưu ý bảo mật

- Token được lưu trong `chrome.storage.local` — chỉ extension này có thể đọc.
- Extension **không** gửi token đến bất kỳ server nào ngoài `api.github.com`.
- Khi xóa extension, token bị xóa theo.
- Nên đặt expiration cho token và chỉ cấp đúng quyền cần thiết.

---

## License

[MIT](./LICENSE) © 2026 [Tony Thang](https://github.com/tranthangit)
