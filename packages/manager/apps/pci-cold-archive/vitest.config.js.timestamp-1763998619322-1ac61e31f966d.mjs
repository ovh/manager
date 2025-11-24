// packages/manager/apps/pci-cold-archive/vitest.config.js
import path from "path";
import { defineConfig } from "file:///Users/hbenkhal/Desktop/git_workspace/manager/node_modules/vite/dist/node/index.js";
import react from "file:///Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-cold-archive/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-cold-archive";
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
        "src/wrapperRenders.tsx",
        "src/core/**",
        "src/**/*.{spec,test}.{ts,tsx}"
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvbWFuYWdlci9hcHBzL3BjaS1jb2xkLWFyY2hpdmUvdml0ZXN0LmNvbmZpZy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9oYmVua2hhbC9EZXNrdG9wL2dpdF93b3Jrc3BhY2UvbWFuYWdlci9wYWNrYWdlcy9tYW5hZ2VyL2FwcHMvcGNpLWNvbGQtYXJjaGl2ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktY29sZC1hcmNoaXZlL3ZpdGVzdC5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktY29sZC1hcmNoaXZlL3ZpdGVzdC5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICB0ZXN0OiB7XG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICBlbnZpcm9ubWVudDogJ2pzZG9tJyxcbiAgICBzZXR1cEZpbGVzOiAnLi9zcmMvc2V0dXBUZXN0cy50c3gnLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICBpbmNsdWRlOiBbJ3NyYyddLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnc3JjL2ludGVyZmFjZScsXG4gICAgICAgICdzcmMvX190ZXN0c19fJyxcbiAgICAgICAgJ3NyYy8qKi8qY29uc3RhbnRzLnRzJyxcbiAgICAgICAgJ3NyYy8qKi8qZW51bS50cycsXG4gICAgICAgICdzcmMvdml0ZS0qLnRzJyxcbiAgICAgICAgJ3NyYy9BcHAudHN4JyxcbiAgICAgICAgJ3NyYy9jb3JlL1NoZWxsUm91dGluZ1N5bmMudHN4JyxcbiAgICAgICAgJ3NyYy9pMThuLnRzJyxcbiAgICAgICAgJ3NyYy9tYWluLnRzeCcsXG4gICAgICAgICdzcmMvcGFnZXMvTGF5b3V0LnRzeCcsXG4gICAgICAgICdzcmMvcm91dGVzLnRzeCcsXG4gICAgICAgICdzcmMvd3JhcHBlclJlbmRlcnMudHN4JyxcbiAgICAgICAgJ3NyYy9jb3JlLyoqJyxcbiAgICAgICAgJ3NyYy8qKi8qLntzcGVjLHRlc3R9Lnt0cyx0c3h9JyxcbiAgICAgIF0sXG4gICAgfSxcbiAgfSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICAgIG1haW5GaWVsZHM6IFsnbW9kdWxlJ10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBa2IsT0FBTyxVQUFVO0FBQ25jLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUZsQixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osVUFBVTtBQUFBLE1BQ1IsU0FBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsSUFDQSxZQUFZLENBQUMsUUFBUTtBQUFBLEVBQ3ZCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
