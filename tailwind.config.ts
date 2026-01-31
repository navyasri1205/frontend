import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6ffe6',
          100: '#ccffcc',
          200: '#99ff99',
          300: '#66ff66',
          400: '#33ff33',
          500: '#00b050',
          600: '#009944',
          700: '#008238',
          800: '#006b2e',
          900: '#005424',
        },
        header: '#374151',
        sidebar: { bg: '#ffffff', border: '#e5e7eb', active: '#e6ffe6' },
      },
    },
  },
  plugins: [],
};

export default config;
