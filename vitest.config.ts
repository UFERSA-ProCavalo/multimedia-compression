import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Use 'node' for pure TS, 'jsdom' for React
    globals: true,
  },
});
