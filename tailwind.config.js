/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./popup.html', './popup.js', './icons.js'],
  theme: {
    extend: {
      colors: {
        gh: {
          bg:      '#0d1117',
          bg2:     '#161b22',
          bg3:     '#21262d',
          bg4:     '#30363d',
          border:  '#30363d',
          border2: '#444c56',
          text:    '#e6edf3',
          muted:   '#8b949e',
          subtle:  '#6e7681',
          accent:  '#58a6ff',
          'accent-hover': '#79b8ff',
          green:   '#3fb950',
          'green-bg': '#12261e',
          'green-border': '#1f4a2d',
          red:     '#f85149',
          'red-bg':     '#2d1214',
          'red-border': '#6e2020',
          purple:  '#bc8cff',
          'purple-bg': '#261a2e',
          'purple-border': '#3d2a50',
          yellow:  '#d29922',
        },
      },
      animation: {
        'spin-fast': 'spin 0.6s linear infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'progress': 'progress 1.5s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      width: { popup: '480px' },
      maxHeight: { popup: '600px' },
    },
  },
  plugins: [],
};
