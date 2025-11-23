import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        neutral: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          900: '#0A0A0A',
        },
        slate: {
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
        },
        blue: {
          600: '#2563EB',
          700: '#1D4ED8',
        },
      },
      fontFamily: {
        serif: ['Garamond', 'Georgia', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        '1': '0.25rem',
        '2': '0.5rem',
        '4': '1rem',
        '6': '1.5rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '24': '6rem',
        '32': '8rem',
      },
    },
  },
  plugins: [],
}

export default config
