import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.ts"],
    testTimeout: 30000,
    hookTimeout: 30000,
    server: {
      deps: {
        inline: ["next-auth"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next/server": path.resolve(__dirname, "./tests/__mocks__/next-server.ts"),
    },
  },
});
