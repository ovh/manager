// packages/manager/apps/pci-block-storage/vitest.config.js
import { defaultDedupedDependencies } from "file:///Users/hbenkhal/Desktop/git_workspace/manager/packages/manager-tools/manager-tests-setup/src/index.js";
import path from "path";
import { defineConfig } from "file:///Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-block-storage/node_modules/.pnpm/vite@6.3.4_@types+node@24.10.1_jiti@1.21.7_sass@1.93.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-block-storage/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@6.3.4_@types+node@24.10.1_jiti@1.21.7_sass@1.93.0_/node_modules/@vitejs/plugin-react/dist/index.js";
var __vite_injected_original_dirname = "/Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/apps/pci-block-storage";
var vitest_config_default = defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    server: {
      deps: {
        inline: [/@ovhcloud\/ods-react\/.*/i]
      }
    },
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
        "src/core/HidePreloader.tsx",
        "src/i18n.ts",
        "src/main.tsx",
        "src/routes.tsx",
        "src/queryClient.ts"
      ]
    }
  },
  resolve: {
    dedupe: [...defaultDedupedDependencies],
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    },
    mainFields: ["module"]
  }
});
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvbWFuYWdlci9hcHBzL3BjaS1ibG9jay1zdG9yYWdlL3ZpdGVzdC5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaGJlbmtoYWwvRGVza3RvcC9naXRfd29ya3NwYWNlL21hbmFnZXIvcGFja2FnZXMvbWFuYWdlci9hcHBzL3BjaS1ibG9jay1zdG9yYWdlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvaGJlbmtoYWwvRGVza3RvcC9naXRfd29ya3NwYWNlL21hbmFnZXIvcGFja2FnZXMvbWFuYWdlci9hcHBzL3BjaS1ibG9jay1zdG9yYWdlL3ZpdGVzdC5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvYXBwcy9wY2ktYmxvY2stc3RvcmFnZS92aXRlc3QuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmYXVsdERlZHVwZWREZXBlbmRlbmNpZXMgfSBmcm9tICdAb3ZoLXV4L21hbmFnZXItdGVzdHMtc2V0dXAnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHRlc3Q6IHtcbiAgICBnbG9iYWxzOiB0cnVlLFxuICAgIGVudmlyb25tZW50OiAnanNkb20nLFxuICAgIHNldHVwRmlsZXM6ICcuL3NyYy9zZXR1cFRlc3RzLnRzJyxcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGRlcHM6IHtcbiAgICAgICAgaW5saW5lOiBbL0BvdmhjbG91ZFxcL29kcy1yZWFjdFxcLy4qL2ldLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICBpbmNsdWRlOiBbJ3NyYyddLFxuICAgICAgZXhjbHVkZTogW1xuICAgICAgICAnc3JjL2ludGVyZmFjZScsXG4gICAgICAgICdzcmMvX190ZXN0c19fJyxcbiAgICAgICAgJ3NyYy8qKi8qY29uc3RhbnRzLnRzJyxcbiAgICAgICAgJ3NyYy8qKi8qZW51bS50cycsXG4gICAgICAgICdzcmMvdml0ZS0qLnRzJyxcbiAgICAgICAgJ3NyYy9BcHAudHN4JyxcbiAgICAgICAgJ3NyYy9jb3JlL1NoZWxsUm91dGluZ1N5bmMudHN4JyxcbiAgICAgICAgJ3NyYy9jb3JlL0hpZGVQcmVsb2FkZXIudHN4JyxcbiAgICAgICAgJ3NyYy9pMThuLnRzJyxcbiAgICAgICAgJ3NyYy9tYWluLnRzeCcsXG4gICAgICAgICdzcmMvcm91dGVzLnRzeCcsXG4gICAgICAgICdzcmMvcXVlcnlDbGllbnQudHMnLFxuICAgICAgXSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgZGVkdXBlOiBbLi4uZGVmYXVsdERlZHVwZWREZXBlbmRlbmNpZXNdLFxuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICAgIG1haW5GaWVsZHM6IFsnbW9kdWxlJ10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcWIsU0FBUyxrQ0FBa0M7QUFDaGUsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsb0JBQW9CO0FBQzdCLE9BQU8sV0FBVztBQUhsQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHdCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFDakIsTUFBTTtBQUFBLElBQ0osU0FBUztBQUFBLElBQ1QsYUFBYTtBQUFBLElBQ2IsWUFBWTtBQUFBLElBQ1osUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLFFBQ0osUUFBUSxDQUFDLDJCQUEyQjtBQUFBLE1BQ3RDO0FBQUEsSUFDRjtBQUFBLElBQ0EsVUFBVTtBQUFBLE1BQ1IsU0FBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLFFBQVEsQ0FBQyxHQUFHLDBCQUEwQjtBQUFBLElBQ3RDLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNwQztBQUFBLElBQ0EsWUFBWSxDQUFDLFFBQVE7QUFBQSxFQUN2QjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
