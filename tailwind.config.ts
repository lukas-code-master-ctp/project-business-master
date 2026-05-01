import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f2f6f9',
        surface: '#e2eaf2',
        card: '#ffffff',
        blue: {
          DEFAULT: '#003ef3',
          light: '#0490ff',
          dark: '#010072',
          purple: '#4436ff',
        },
        success: '#00b87a',
        warning: '#f59e0b',
      },
      fontFamily: {
        syne: ['var(--font-syne)', 'sans-serif'],
        outfit: ['var(--font-outfit)', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'grad-light': 'linear-gradient(90deg, #003ef3, #0490ff)',
        'grad-dark': 'linear-gradient(135deg, #4436ff, #010072)',
      },
    },
  },
  plugins: [],
}
export default config
