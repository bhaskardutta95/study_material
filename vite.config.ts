import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base ('./') keeps asset URLs portable, so the same build works on
// GitHub Pages project sites (username.github.io/<repo>/), a custom domain,
// or local `vite preview` — no per-deploy path config needed.
export default defineConfig({
  base: './',
  plugins: [react()],
});
