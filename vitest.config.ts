import { defineConfig } from "vitest/config";
import { sharedConfig } from "@repo/vitest-config";
export default defineConfig({
  ...sharedConfig,
  projects: ["packages/*/vitest.config.ts"],
});
