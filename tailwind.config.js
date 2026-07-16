/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6F4E37',
          light: '#A07C5B',
        },
        mint: '#DFC9AC',
        surface: '#F5EFE7',
        ink: {
          DEFAULT: '#2A2019',
          soft: '#8A7A6A',
        },
        line: '#E7DED3',
        success: '#8A6244',
        warning: '#E0A63A',
        danger: '#D2555A',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Myanmar', 'Pyidaungsu', 'system-ui', 'sans-serif'],
        mm: ['Noto Sans Myanmar', 'Pyidaungsu', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        '2xl': '16px',
      },
      boxShadow: {
        soft: '0 2px 12px rgba(30, 42, 40, 0.06)',
        card: '0 4px 20px rgba(30, 42, 40, 0.08)',
      },
      maxWidth: {
        phone: '480px',
      },
    },
  },
  plugins: [],
}
