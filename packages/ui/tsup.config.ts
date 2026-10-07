import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["src/**/*.ts", "src/**/*.tsx"],
    exclude: ["**/*.test.ts", "**/*.test.tsx", "**/*.stories.tsx"],
  format: ["cjs", "esm"],
  dts: true,
  external: ["react"],
  ...options,
}));
