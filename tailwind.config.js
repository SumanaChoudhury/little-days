/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        insta: {
          bg: '#fafafa',
          darkBg: '#000000',
          card: '#ffffff',
          darkCard: '#121212',
          border: '#dbdbdb',
          darkBorder: '#262626',
          primary: '#0095f6',
          accent: '#ed4956',
          secondary: '#737373',
          darkSecondary: '#a8a8a8'
        }
      },
      fontFamily: {
        instagram: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        script: ['"Playfair Display"', 'Georgia', 'serif']
      },
      animation: {
        'like-bounce': 'likeBounce 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'fade-in': 'fadeIn 0.2s ease-out forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      },
      keyframes: {
        likeBounce: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.35)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
