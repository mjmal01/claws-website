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
        // Core backgrounds
        space: {
          DEFAULT: '#000000',
          50:  '#f0f0f5',
          100: '#e0e0eb',
          200: '#c1c1d6',
          300: '#9292b8',
          400: '#636394',
          500: '#44446e',
          600: '#2e2e50',
          700: '#1e1e38',
          800: '#141428',
          900: '#0d0d1a',
          950: '#0a0a0f',
        },
        // Neutral grays for UI surfaces
        surface: {
          DEFAULT: '#0d0d0d',
          raised:  '#111111',
          overlay: '#1a1a1a',
          border:  'rgba(255,255,255,0.10)',
          muted:   'rgba(255,255,255,0.18)',
        },
        // Typography
        'white-90': 'rgba(255,255,255,0.90)',
        'white-70': 'rgba(255,255,255,0.70)',
        'white-50': 'rgba(255,255,255,0.50)',
        'white-30': 'rgba(255,255,255,0.30)',
        'white-10': 'rgba(255,255,255,0.10)',
        // Michigan maize accent
        maize: {
          DEFAULT: '#FFCB05',
          light:   '#FFD84D',
          dark:    '#E6B800',
          muted:   'rgba(255,203,5,0.15)',
        },
        // CLAWS blue
        'claws-blue': {
          DEFAULT: '#2563eb',
          light:   '#3b82f6',
          dark:    '#1d4ed8',
        },
        // Status colors
        status: {
          active:   '#22c55e',
          at_risk:  '#eab308',
          review:   '#ef4444',
          inactive: '#6b7280',
        },
        // Accent — nebula blue
        nebula: {
          DEFAULT: '#4f6ef7',
          light:   '#7b93f9',
          dark:    '#3450d4',
          muted:   'rgba(79,110,247,0.15)',
        },
      },

      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      fontSize: {
        'display-2xl': ['5rem',   { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl':  ['4rem',   { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg':  ['3.25rem', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-md':  ['2.5rem',  { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm':  ['2rem',    { lineHeight: '1.3',  letterSpacing: '-0.005em', fontWeight: '700' }],
      },

      spacing: {
        '18':  '4.5rem',
        '88':  '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      borderRadius: {
        '4xl': '2rem',
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-space':  'radial-gradient(ellipse at 50% 0%, #1e1e38 0%, #0a0a0f 70%)',
        'gradient-hero':   'radial-gradient(ellipse at 60% 40%, rgba(79,110,247,0.15) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(255,203,5,0.08) 0%, transparent 50%)',
        'gradient-card':   'linear-gradient(135deg, #16161f 0%, #111118 100%)',
        'gradient-maize':  'linear-gradient(135deg, #FFCB05 0%, #E6B800 100%)',
      },

      boxShadow: {
        'glow-maize':  '0 0 30px rgba(255,203,5,0.2)',
        'glow-nebula': '0 0 30px rgba(79,110,247,0.25)',
        'card':        '0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover':  '0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08)',
      },

      animation: {
        'fade-up':    'fadeUp 0.5s ease-out forwards',
        'fade-in':    'fadeIn 0.4s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':      'float 6s ease-in-out infinite',
        'marquee':    'marquee 30s linear infinite',
      },

      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },

      screens: {
        xs: '480px',
      },

      transitionDuration: {
        '400': '400ms',
      },
    },
  },
  plugins: [],
}

export default config
