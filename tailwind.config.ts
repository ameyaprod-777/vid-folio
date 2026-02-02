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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'foreground-muted': 'var(--foreground-muted)',
        border: 'var(--border)',
        // Palette Royale
        'royal-gold': {
          DEFAULT: '#D4AF37',
          light: '#F4C430',
          dark: '#B8941F',
        },
        'royal-purple': {
          DEFAULT: '#6B2C91',
          light: '#8B4FA8',
        },
        'royal-blue': '#1E3A8A',
        'royal-navy': '#0F172A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
      },
      fontWeight: {
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        normal: '-0.01em',
        wide: '0.05em',
        wider: '0.1em',
      },
      boxShadow: {
        'royal-gold': '0 0 30px rgba(212, 175, 55, 0.3)',
        'royal-gold-lg': '0 0 60px rgba(212, 175, 55, 0.4)',
      },
    },
  },
  plugins: [],
}
export default config