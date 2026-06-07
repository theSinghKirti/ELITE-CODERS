import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#14b8a6',
          dark: '#0d9488',
        },
        emerald: {
          DEFAULT: '#10b981',
        },
        glass: 'rgba(255,255,255,0.08)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
        'float': 'float 4s infinite ease-in-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            transform: 'scale(1)', 
            opacity: '0.8', 
            boxShadow: '0 0 0 0 rgba(20, 184, 166, 0.4)' 
          },
          '50%': { 
            transform: 'scale(1.05)', 
            opacity: '1', 
            boxShadow: '0 0 20px 10px rgba(20, 184, 166, 0.2)' 
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
};

export default config;
