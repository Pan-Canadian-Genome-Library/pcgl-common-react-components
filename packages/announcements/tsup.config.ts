import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entryPoints: ['src/index.ts'],
  format: ['cjs', 'esm'],
  external: ['react', '@repo/ui'],
  clean: !options.watch,
  ...options,
}));
