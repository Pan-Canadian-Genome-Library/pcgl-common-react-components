export const sharedConfig = {
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["@repo/vitest-config/setup"],
    // Other shared configuration
  },
};
