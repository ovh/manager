// packages/manager/apps/pci-quota/vitest.config.js
import path from "path";
import { defineConfig } from "file:///Users/hbenkhal/Desktop/git_workspace/manager/node_modules/vite/dist/node/index.js";
import react from "file:///Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-quota/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-quota";
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
        "src/**/*constants.ts",
        "src/**/*enum.ts",
        "src/vite-*.ts",
        "src/App.tsx",
        "src/core/ShellRoutingSync.tsx",
        "src/i18n.ts",
        "src/main.tsx",
        "src/pages/Layout.tsx",
        "src/routes.tsx",
        "src/queryClient.ts",
        "src/wrapperRenders.tsx",
        "src/core/HidePreloader.tsx",
        "src/hooks/usePageTracking.ts"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvbWFuYWdlci9hcHBzL3BjaS1xdW90YS92aXRlc3QuY29uZmlnLmpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktcXVvdGFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9oYmVua2hhbC9EZXNrdG9wL2dpdF93b3Jrc3BhY2UvbWFuYWdlci9wYWNrYWdlcy9tYW5hZ2VyL2FwcHMvcGNpLXF1b3RhL3ZpdGVzdC5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktcXVvdGEvdml0ZXN0LmNvbmZpZy5qc1wiO2ltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBzZXR1cEZpbGVzOiAnLi9zcmMvc2V0dXBUZXN0cy50c3gnLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICBpbmNsdWRlOiBbJ3NyYyddLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnc3JjL2ludGVyZmFjZScsXG4gICAgICAgICdzcmMvX190ZXN0c19fJyxcbiAgICAgICAgJ3NyYy8qKi8qY29uc3RhbnRzLnRzJyxcbiAgICAgICAgJ3NyYy8qKi8qZW51bS50cycsXG4gICAgICAgICdzcmMvdml0ZS0qLnRzJyxcbiAgICAgICAgJ3NyYy9BcHAudHN4JyxcbiAgICAgICAgJ3NyYy9jb3JlL1NoZWxsUm91dGluZ1N5bmMudHN4JyxcbiAgICAgICAgJ3NyYy9pMThuLnRzJyxcbiAgICAgICAgJ3NyYy9tYWluLnRzeCcsXG4gICAgICAgICdzcmMvcGFnZXMvTGF5b3V0LnRzeCcsXG4gICAgICAgICdzcmMvcm91dGVzLnRzeCcsXG4gICAgICAgICdzcmMvcXVlcnlDbGllbnQudHMnLFxuICAgICAgICAnc3JjL3dyYXBwZXJSZW5kZXJzLnRzeCcsXG4gICAgICAgICdzcmMvY29yZS9IaWRlUHJlbG9hZGVyLnRzeCcsXG4gICAgICAgICdzcmMvaG9va3MvdXNlUGFnZVRyYWNraW5nLnRzJyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICAgIG1haW5GaWVsZHM6IFsnbW9kdWxlJ10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlosT0FBTyxVQUFVO0FBQzlhLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUZsQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osVUFBVTtBQUFBLE1BQ1IsU0FBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNwQztBQUFBLElBQ0EsWUFBWSxDQUFDLFFBQVE7QUFBQSxFQUN2QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
