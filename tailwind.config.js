/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FCFFFF',
        secondary: { DEFAULT: '#99E1D9', hover: '#7FD1C8' },
        tertiary: { DEFAULT: '#202C39', hover: '#18222D' },
        gold: '#F59E0B',
        surface: '#F8FAFC',
        border: {
          DEFAULT: '#E2E8F0',
          subtle: 'rgba(226, 232, 240, 0.85)',
          focus: 'rgba(153, 225, 217, 0.65)',
        },
        muted: '#475569',
        success: '#16A34A',
        error: '#DC2626',
      },
    },
  },
  plugins: [],
};
