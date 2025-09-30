// vitest.config.js
import path from "path";
import { defineConfig } from "file:///Users/hbenkhal/Desktop/git_workspace/manager-new-version/node_modules/vite/dist/node/index.js";
import react from "file:///Users/hbenkhal/Desktop/git_workspace/manager-new-version/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/hbenkhal/Desktop/git_workspace/manager-new-version/packages/manager/apps/pci-ssh-keys";
var vitest_config_default = defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.tsx",
    coverage: {
      include: ["src"],
      exclude: [
        "src/interface",
        "src/__tests__",
        "src/__tests__",
        "src/**/*constants.ts",
        "src/vite-*.ts",
        "src/vite-*.ts",
        "src/App.tsx",
        "src/App.tsx",
        "src/core/ShellRoutingSync.tsx",
        "src/core/ShellRoutingSync.tsx",
        "src/core/HidePreloader.tsx",
        "src/i18n.ts",
        "src/i18n.ts",
        "src/main.tsx",
        "src/main.tsx",
        "src/routes.tsx",
        "src/routes.tsx",
        "src/queryClient.ts",
        "src/pages/Layout.tsx",
        // This files will be deleted while refactoring sprint, it's the rease we exclude files
        "src/components/error-page/ErrorPage.tsx"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9oYmVua2hhbC9EZXNrdG9wL2dpdF93b3Jrc3BhY2UvbWFuYWdlci1uZXctdmVyc2lvbi9wYWNrYWdlcy9tYW5hZ2VyL2FwcHMvcGNpLXNzaC1rZXlzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvaGJlbmtoYWwvRGVza3RvcC9naXRfd29ya3NwYWNlL21hbmFnZXItbmV3LXZlcnNpb24vcGFja2FnZXMvbWFuYWdlci9hcHBzL3BjaS1zc2gta2V5cy92aXRlc3QuY29uZmlnLmpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9oYmVua2hhbC9EZXNrdG9wL2dpdF93b3Jrc3BhY2UvbWFuYWdlci1uZXctdmVyc2lvbi9wYWNrYWdlcy9tYW5hZ2VyL2FwcHMvcGNpLXNzaC1rZXlzL3ZpdGVzdC5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogJy4vc3JjL3NldHVwVGVzdHMudHN4JyxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgaW5jbHVkZTogWydzcmMnXSxcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgJ3NyYy9pbnRlcmZhY2UnLFxuICAgICAgICAnc3JjL19fdGVzdHNfXycsXG4gICAgICAgICdzcmMvX190ZXN0c19fJyxcbiAgICAgICAgJ3NyYy8qKi8qY29uc3RhbnRzLnRzJyxcbiAgICAgICAgJ3NyYy92aXRlLSoudHMnLFxuICAgICAgICAnc3JjL3ZpdGUtKi50cycsXG4gICAgICAgICdzcmMvQXBwLnRzeCcsXG4gICAgICAgICdzcmMvQXBwLnRzeCcsXG4gICAgICAgICdzcmMvY29yZS9TaGVsbFJvdXRpbmdTeW5jLnRzeCcsXG4gICAgICAgICdzcmMvY29yZS9TaGVsbFJvdXRpbmdTeW5jLnRzeCcsXG4gICAgICAgICdzcmMvY29yZS9IaWRlUHJlbG9hZGVyLnRzeCcsXG4gICAgICAgICdzcmMvaTE4bi50cycsXG4gICAgICAgICdzcmMvaTE4bi50cycsXG4gICAgICAgICdzcmMvbWFpbi50c3gnLFxuICAgICAgICAnc3JjL21haW4udHN4JyxcbiAgICAgICAgJ3NyYy9yb3V0ZXMudHN4JyxcbiAgICAgICAgJ3NyYy9yb3V0ZXMudHN4JyxcbiAgICAgICAgJ3NyYy9xdWVyeUNsaWVudC50cycsXG4gICAgICAgICdzcmMvcGFnZXMvTGF5b3V0LnRzeCcsXG4gICAgICAgIC8vIFRoaXMgZmlsZXMgd2lsbCBiZSBkZWxldGVkIHdoaWxlIHJlZmFjdG9yaW5nIHNwcmludCwgaXQncyB0aGUgcmVhc2Ugd2UgZXhjbHVkZSBmaWxlc1xuICAgICAgICAnc3JjL2NvbXBvbmVudHMvZXJyb3ItcGFnZS9FcnJvclBhZ2UudHN4JyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICAgIG1haW5GaWVsZHM6IFsnbW9kdWxlJ10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMGMsT0FBTyxVQUFVO0FBQzNkLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUZsQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osVUFBVTtBQUFBLE1BQ1IsU0FBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUE7QUFBQSxRQUVBO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxLQUFLO0FBQUEsSUFDcEM7QUFBQSxJQUNBLFlBQVksQ0FBQyxRQUFRO0FBQUEsRUFDdkI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
