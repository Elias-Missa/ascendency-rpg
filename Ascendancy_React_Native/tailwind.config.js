/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        foreground: '#e8f1f5',
        card: '#0f1419',
        cardForeground: '#e8f1f5',
        primary: '#00e5ff',
        primaryForeground: '#0d1314',
        secondary: '#1a2733',
        secondaryForeground: '#75dcf5',
        muted: '#181c22',
        mutedForeground: '#7a828c',
        accent: '#00d4eb',
        accentForeground: '#0d1314',
        destructive: '#e53935',
        destructiveForeground: '#ffffff',
        border: '#1f3040',
        input: '#1d262e',
        ring: '#00e5ff',
        xpBar: '#00e5ff',
        levelGold: '#ffc107',
        premiumPurple: '#9c27b0',
        healthBar: '#4caf50',
      },
      fontFamily: {
        display: ['Orbitron'],
        mono: ['JetBrainsMono'],
        body: ['Inter'],
        sans: ['Inter'],
      }
    },
  },
  plugins: [],
}

