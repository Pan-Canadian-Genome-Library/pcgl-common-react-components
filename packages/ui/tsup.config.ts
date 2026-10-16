import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!src/**/*.d.ts",
    "!src/**/tests/**",
    "!src/**/*.test.*",
    "!src/**/*.stories.*",
  ],
  format: ["cjs", "esm"],
  external: ["react"],
  clean: true,
  injectStyle: true,
  loader: {".svg": "dataurl", },
  ...options,
}));
