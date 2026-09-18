/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        base: '#0B0F15',
        panel: '#131A24',
        'panel-alt': '#182230',
        'panel-hover': '#1E2C3D',
        'panel-card': 'rgba(19, 26, 36, 0.85)',
        border: '#233041',
        'border-focus': '#3B82F6',
        'border-cyan': 'rgba(45, 212, 191, 0.3)',
        'text-main': '#F1F5F9',
        'text-dim': '#94A3B8',
        'text-muted': '#64748B',
        teal: {
          DEFAULT: '#2DD4BF',
          live: '#2DD4BF',
          glow: 'rgba(45, 212, 191, 0.4)',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          glow: 'rgba(6, 182, 212, 0.4)',
        },
        amber: {
          DEFAULT: '#F59E0B',
          alert: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.4)',
        },
        rust: {
          DEFAULT: '#F43F5E',
          danger: '#F43F5E',
          glow: 'rgba(244, 63, 94, 0.4)',
        },
        olive: {
          DEFAULT: '#10B981',
          veg: '#10B981',
          glow: 'rgba(16, 185, 129, 0.4)',
        },
        water: {
          DEFAULT: '#38BDF8',
          blue: '#38BDF8',
          glow: 'rgba(56, 189, 248, 0.4)',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'IBM Plex Mono', 'monospace'],
      },
      boxShadow: {
        'glow-teal': '0 0 25px -5px rgba(45, 212, 191, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(6, 182, 212, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'glow-rust': '0 0 25px -5px rgba(244, 63, 94, 0.3)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'spin-slow': 'spin 16s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar-sweep 4s linear infinite',
        'stream-flow': 'stream-flow 2s linear infinite',
      },
    },
  },
  plugins: [],
};
