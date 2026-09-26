/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F6E6E',
          hover: '#0B5A6B',
          light: '#E6F4F4',
          dark: '#084350',
        },
        accent: {
          DEFAULT: '#C89B3C',
          hover: '#B5872F',
          light: '#FBF5E8',
        },
        neutral: {
          bg: '#FAFAF8',
          surface: '#FFFFFF',
          border: '#E9EAE6',
          text: '#1E2422',
          muted: '#5B6360',
          subtle: '#8C9491',
        },
        status: {
          success: '#2F855A',
          'success-bg': '#E6F4EA',
          warning: '#B7791F',
          'warning-bg': '#FEF3C7',
          error: '#C53030',
          'error-bg': '#FEE2E2',
          info: '#2B6CB0',
          'info-bg': '#EBF8FF',
        },
      },
      borderRadius: {
        card: '8px',
        button: '6px',
        input: '6px',
      },
      boxShadow: {
        subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        card: '0 2px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        dropdown: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

