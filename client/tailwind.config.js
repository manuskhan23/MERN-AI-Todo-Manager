/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#3B82F6', hover: '#2563EB' },
        light: '#93C5FD',
        bg: '#EFF6FF',
        card: '#FFFFFF',
        dark: '#1E293B',
        secondary: '#64748B',
        status: '#DBEAFE'
      }
    },
  },
  plugins: [],
}