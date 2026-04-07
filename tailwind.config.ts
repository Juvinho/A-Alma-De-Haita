import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0a',
        'bg-secondary': '#111111',
        'text-primary': '#c9b99a',
        'text-secondary': '#8a7a5a',
        'accent-crimson': '#8b0000',
        'accent-blood': '#4a0000',
        'accent-gold': '#d4a017',
        'accent-void': '#1a0a2e',
        'error': '#ff3333',
        'success': '#1a8a1a',
      },
      fontFamily: {
        display: ['Cinzel Decorative', 'Playfair Display', 'serif'],
        body: ['Cormorant Garamond', 'Crimson Text', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        cinzel: ['var(--font-cinzel)', 'Cinzel', 'serif'],
        cormorant: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
        fira: ['var(--font-fira)', 'Fira Code', 'monospace'],
      },
      animation: {
        'vn-shake': 'vnShake 0.5s ease-in-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 3s infinite',
        'float': 'float 8s ease-in-out infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'veil-open': 'veilOpen 1s ease-out forwards',
        'whisper-in': 'whisperIn 2s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
        'breathe': 'breathe 6s ease-in-out infinite',
      },
      keyframes: {
        flicker: {
          '0%, 95%, 100%': { opacity: '1' },
          '96%': { opacity: '0.4' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.2' },
          '99%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 1px)' },
          '40%': { transform: 'translate(2px, -1px)' },
          '60%': { transform: 'translate(-1px, 2px)' },
          '80%': { transform: 'translate(1px, -2px)' },
        },
        veilOpen: {
          '0%': { clipPath: 'inset(0 50% 0 50%)' },
          '100%': { clipPath: 'inset(0 0% 0 0%)' },
        },
        whisperIn: {
          '0%': { opacity: '0', letterSpacing: '0.5em' },
          '100%': { opacity: '1', letterSpacing: 'normal' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '15%': { transform: 'translateX(-4px)' },
          '30%': { transform: 'translateX(4px)' },
          '45%': { transform: 'translateX(-3px)' },
          '60%': { transform: 'translateX(3px)' },
          '75%': { transform: 'translateX(-2px)' },
          '90%': { transform: 'translateX(2px)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        vnShake: {
          '0%, 100%': { transform: 'translate(0,0)' },
          '15%': { transform: 'translate(-3px,-1px)' },
          '30%': { transform: 'translate(3px,1px)' },
          '45%': { transform: 'translate(-2px,1px)' },
          '60%': { transform: 'translate(2px,-1px)' },
          '75%': { transform: 'translate(-1px,0px)' },
          '90%': { transform: 'translate(1px,1px)' },
        },
      },
      boxShadow: {
        'haita': '0 0 20px #ff1a1a33, 0 0 40px #8b000022',
        'gold': '0 0 15px #d4a01744, 0 0 30px #d4a01722',
        'void': '0 0 30px #1a0a2e88',
      },
    },
  },
  plugins: [],
};

export default config;
