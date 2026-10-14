import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: [
    "src/**/*.ts",
    "src/**/*.tsx",
    "!src/**/tests/**",
    "!src/**/*.test.*",
    "!src/**/*.stories.*",
  ],
  format: ["cjs", "esm"],
  external: ["react"],
  ...options,
}));
