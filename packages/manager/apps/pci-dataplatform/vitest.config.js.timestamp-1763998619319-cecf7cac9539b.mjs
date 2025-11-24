// packages/manager/apps/pci-dataplatform/vitest.config.js
import path from "path";
import { defineConfig } from "file:///Users/hbenkhal/Desktop/git_workspace/manager/node_modules/vite/dist/node/index.js";
import react from "file:///Users/hbenkhal/Desktop/git_workspace/manager/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "/Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-dataplatform";
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvbWFuYWdlci9hcHBzL3BjaS1kYXRhcGxhdGZvcm0vdml0ZXN0LmNvbmZpZy5qcyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9oYmVua2hhbC9EZXNrdG9wL2dpdF93b3Jrc3BhY2UvbWFuYWdlci9wYWNrYWdlcy9tYW5hZ2VyL2FwcHMvcGNpLWRhdGFwbGF0Zm9ybVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktZGF0YXBsYXRmb3JtL3ZpdGVzdC5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktZGF0YXBsYXRmb3JtL3ZpdGVzdC5jb25maWcuanNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0JztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtyZWFjdCgpXSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWycuL3NyYy9fX3Rlc3RzX18vc2V0dXBUZXN0LnRzJ10sXG4gICAgY292ZXJhZ2U6IHtcbiAgICAgIGluY2x1ZGU6IFsnc3JjJ10sXG4gICAgICBleGNsdWRlOiBbXG4gICAgICAgICdzcmMvX190ZXN0c19fJyxcbiAgICAgICAgJ3NyYy92aXRlLSoudHMnLFxuICAgICAgICAnc3JjL0FwcC50c3gnLFxuICAgICAgICAnc3JjL2kxOG4udHMnLFxuICAgICAgICAnc3JjL2luZGV4LnRzeCcsXG4gICAgICAgICdzcmMvcm91dGVzL3JvdXRlcy50c3gnLFxuICAgICAgICAnc3JjL3JvdXRlcy9Sb3V0ZXIudHN4JyxcbiAgICAgICAgJ3NyYy9xdWVyeS5jbGllbnQudHMnLFxuICAgICAgICAnc3JjL2NvbmZpZ3VyYXRpb24nLFxuICAgICAgICAnc3JjLyoqLypjb25zdGFudHMudHMnLFxuICAgICAgICAnc3JjL21haW4udHN4JyxcbiAgICAgICAgJ3NyYy90eXBlcycsXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjJyksXG4gICAgfSxcbiAgICBtYWluRmllbGRzOiBbJ21vZHVsZSddLFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWtiLE9BQU8sVUFBVTtBQUNuYyxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFGbEIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyx3QkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLE1BQU07QUFBQSxJQUNKLFNBQVM7QUFBQSxJQUNULGFBQWE7QUFBQSxJQUNiLFlBQVksQ0FBQyw4QkFBOEI7QUFBQSxJQUMzQyxVQUFVO0FBQUEsTUFDUixTQUFTLENBQUMsS0FBSztBQUFBLE1BQ2YsU0FBUztBQUFBLFFBQ1A7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsSUFDQSxZQUFZLENBQUMsUUFBUTtBQUFBLEVBQ3ZCO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
