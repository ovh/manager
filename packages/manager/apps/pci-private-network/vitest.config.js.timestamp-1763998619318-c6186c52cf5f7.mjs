// packages/manager/apps/pci-private-network/vitest.config.js
import path from "path";
import { defineConfig } from "file:///Users/hbenkhal/Desktop/git_workspace/manager/node_modules/vite/dist/node/index.js";
import react from "file:///Users/hbenkhal/Desktop/git_workspace/manager/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-private-network";
function relativeImgPathImport() {
  return {
    name: "relative-img-path-import",
    transform(_code, id) {
      if (/(jpg|jpeg|png|webp|gif|svg)$/.test(id)) {
        const imgSrc = path.relative(process.cwd(), id);
        return {
          code: `export default '${imgSrc}'`
        };
      }
      return void 0;
    }
  };
}
var vitest_config_default = defineConfig({
  plugins: [react(), relativeImgPathImport()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    coverage: {
      include: ["src"],
      exclude: [
        "src/interface",
        "src/__tests__",
        "src/**/*constants.ts",
        "src/vite-*.ts",
        "src/App.tsx",
        "src/core/ShellRoutingSync.tsx",
        "src/core/HidePreloader.tsx",
        "src/i18n.ts",
        "src/main.tsx",
        "src/routes.tsx",
        "src/queryClient.ts"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvbWFuYWdlci9hcHBzL3BjaS1wcml2YXRlLW5ldHdvcmsvdml0ZXN0LmNvbmZpZy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9oYmVua2hhbC9EZXNrdG9wL2dpdF93b3Jrc3BhY2UvbWFuYWdlci9wYWNrYWdlcy9tYW5hZ2VyL2FwcHMvcGNpLXByaXZhdGUtbmV0d29ya1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktcHJpdmF0ZS1uZXR3b3JrL3ZpdGVzdC5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktcHJpdmF0ZS1uZXR3b3JrL3ZpdGVzdC5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcblxuZnVuY3Rpb24gcmVsYXRpdmVJbWdQYXRoSW1wb3J0KCkge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdyZWxhdGl2ZS1pbWctcGF0aC1pbXBvcnQnLFxuICAgIHRyYW5zZm9ybShfY29kZSwgaWQpIHtcbiAgICAgIGlmICgvKGpwZ3xqcGVnfHBuZ3x3ZWJwfGdpZnxzdmcpJC8udGVzdChpZCkpIHtcbiAgICAgICAgY29uc3QgaW1nU3JjID0gcGF0aC5yZWxhdGl2ZShwcm9jZXNzLmN3ZCgpLCBpZCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29kZTogYGV4cG9ydCBkZWZhdWx0ICcke2ltZ1NyY30nYCxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSxcbiAgfTtcbn1cblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpLCByZWxhdGl2ZUltZ1BhdGhJbXBvcnQoKV0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6ICcuL3NyYy9zZXR1cFRlc3RzLnRzJyxcbiAgICBjb3ZlcmFnZToge1xuICAgICAgaW5jbHVkZTogWydzcmMnXSxcbiAgICAgIGV4Y2x1ZGU6IFtcbiAgICAgICAgJ3NyYy9pbnRlcmZhY2UnLFxuICAgICAgICAnc3JjL19fdGVzdHNfXycsXG4gICAgICAgICdzcmMvKiovKmNvbnN0YW50cy50cycsXG4gICAgICAgICdzcmMvdml0ZS0qLnRzJyxcbiAgICAgICAgJ3NyYy9BcHAudHN4JyxcbiAgICAgICAgJ3NyYy9jb3JlL1NoZWxsUm91dGluZ1N5bmMudHN4JyxcbiAgICAgICAgJ3NyYy9jb3JlL0hpZGVQcmVsb2FkZXIudHN4JyxcbiAgICAgICAgJ3NyYy9pMThuLnRzJyxcbiAgICAgICAgJ3NyYy9tYWluLnRzeCcsXG4gICAgICAgICdzcmMvcm91dGVzLnRzeCcsXG4gICAgICAgICdzcmMvcXVlcnlDbGllbnQudHMnLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgIH0sXG4gICAgbWFpbkZpZWxkczogWydtb2R1bGUnXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUEyYixPQUFPLFVBQVU7QUFDNWMsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxXQUFXO0FBRmxCLElBQU0sbUNBQW1DO0FBSXpDLFNBQVMsd0JBQXdCO0FBQy9CLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQSxJQUNOLFVBQVUsT0FBTyxJQUFJO0FBQ25CLFVBQUksK0JBQStCLEtBQUssRUFBRSxHQUFHO0FBQzNDLGNBQU0sU0FBUyxLQUFLLFNBQVMsUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUM5QyxlQUFPO0FBQUEsVUFDTCxNQUFNLG1CQUFtQixNQUFNO0FBQUEsUUFDakM7QUFBQSxNQUNGO0FBQ0EsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQ0Y7QUFHQSxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxHQUFHLHNCQUFzQixDQUFDO0FBQUEsRUFDMUMsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osVUFBVTtBQUFBLE1BQ1IsU0FBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsSUFDQSxZQUFZLENBQUMsUUFBUTtBQUFBLEVBQ3ZCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
