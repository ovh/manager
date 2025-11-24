// packages/manager/apps/pci-object-storage/vitest.config.js
import path from "path";
import { defineConfig } from "file:///Users/hbenkhal/Desktop/git_workspace/manager/node_modules/vite/dist/node/index.js";
import react from "file:///Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-object-storage/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-object-storage";
var vitest_config_default = defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/__tests__/setupTest.ts"],
    coverage: {
      include: ["src"],
      exclude: [
        "src/__tests__",
        "src/vite-*.ts",
        "src/App.tsx",
        "src/i18n.ts",
        "src/index.tsx",
        "src/routes/routes.tsx",
        "src/routes/Router.tsx",
        "src/query.client.ts",
        "src/configuration",
        "src/**/*constants.ts",
        "src/main.tsx",
        "src/types"
      ]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    },
    mainFields: ["module"]
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvbWFuYWdlci9hcHBzL3BjaS1vYmplY3Qtc3RvcmFnZS92aXRlc3QuY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktb2JqZWN0LXN0b3JhZ2VcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9oYmVua2hhbC9EZXNrdG9wL2dpdF93b3Jrc3BhY2UvbWFuYWdlci9wYWNrYWdlcy9tYW5hZ2VyL2FwcHMvcGNpLW9iamVjdC1zdG9yYWdlL3ZpdGVzdC5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktb2JqZWN0LXN0b3JhZ2Uvdml0ZXN0LmNvbmZpZy5qc1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBzZXR1cEZpbGVzOiBbJy4vc3JjL19fdGVzdHNfXy9zZXR1cFRlc3QudHMnXSxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgaW5jbHVkZTogWydzcmMnXSxcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgJ3NyYy9fX3Rlc3RzX18nLFxuICAgICAgICAnc3JjL3ZpdGUtKi50cycsXG4gICAgICAgICdzcmMvQXBwLnRzeCcsXG4gICAgICAgICdzcmMvaTE4bi50cycsXG4gICAgICAgICdzcmMvaW5kZXgudHN4JyxcbiAgICAgICAgJ3NyYy9yb3V0ZXMvcm91dGVzLnRzeCcsXG4gICAgICAgICdzcmMvcm91dGVzL1JvdXRlci50c3gnLFxuICAgICAgICAnc3JjL3F1ZXJ5LmNsaWVudC50cycsXG4gICAgICAgICdzcmMvY29uZmlndXJhdGlvbicsXG4gICAgICAgICdzcmMvKiovKmNvbnN0YW50cy50cycsXG4gICAgICAgICdzcmMvbWFpbi50c3gnLFxuICAgICAgICAnc3JjL3R5cGVzJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICAgIG1haW5GaWVsZHM6IFsnbW9kdWxlJ10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBd2IsT0FBTyxVQUFVO0FBQ3pjLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUZsQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWSxDQUFDLDhCQUE4QjtBQUFBLElBQzNDLFVBQVU7QUFBQSxNQUNSLFNBQVMsQ0FBQyxLQUFLO0FBQUEsTUFDZixTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDcEM7QUFBQSxJQUNBLFlBQVksQ0FBQyxRQUFRO0FBQUEsRUFDdkI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
