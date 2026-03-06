#!/bin/bash
echo "Installing frontend dependencies & setting up tailwind..."
cd frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo "module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}" > tailwind.config.js

echo "@tailwind base;
@tailwind components;
@tailwind utilities;" > src/index.css

echo "Tailwind setup complete."
