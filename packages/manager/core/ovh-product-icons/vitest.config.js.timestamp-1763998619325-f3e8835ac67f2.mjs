// packages/manager/core/ovh-product-icons/vitest.config.js
import path from "path";
import react from "file:///Users/hbenkhal/Desktop/git_workspace/manager/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///Users/hbenkhal/Desktop/git_workspace/manager/node_modules/vite-plugin-svgr/dist/index.js";
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultExcludedFiles
} from "file:///Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/core/ovh-product-icons/node_modules/@ovh-ux/manager-tests-setup/src/index.js";
var __vite_injected_original_dirname = "/Users/hbenkhal/Desktop/git_workspace/manager/packages/manager/core/ovh-product-icons";
var vitest_config_default = mergeConfig(
  sharedConfig,
  createConfig({
    plugins: [
      react(),
      svgr({
        include: "**/*.svg"
      })
    ],
    test: {
      coverage: {
        exclude: [...defaultExcludedFiles]
      }
    },
    resolve: {
      alias: {
        "@/public": path.resolve(__vite_injected_original_dirname, "public"),
        "@": path.resolve(__vite_injected_original_dirname, "src")
      }
    }
  })
);
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsicGFja2FnZXMvbWFuYWdlci9jb3JlL292aC1wcm9kdWN0LWljb25zL3ZpdGVzdC5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvaGJlbmtoYWwvRGVza3RvcC9naXRfd29ya3NwYWNlL21hbmFnZXIvcGFja2FnZXMvbWFuYWdlci9jb3JlL292aC1wcm9kdWN0LWljb25zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvaGJlbmtoYWwvRGVza3RvcC9naXRfd29ya3NwYWNlL21hbmFnZXIvcGFja2FnZXMvbWFuYWdlci9jb3JlL292aC1wcm9kdWN0LWljb25zL3ZpdGVzdC5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2hiZW5raGFsL0Rlc2t0b3AvZ2l0X3dvcmtzcGFjZS9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvY29yZS9vdmgtcHJvZHVjdC1pY29ucy92aXRlc3QuY29uZmlnLmpzXCI7aW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3Zncic7XG5pbXBvcnQge1xuICBzaGFyZWRDb25maWcsXG4gIG1lcmdlQ29uZmlnLFxuICBjcmVhdGVDb25maWcsXG4gIGRlZmF1bHRFeGNsdWRlZEZpbGVzLFxufSBmcm9tICdAb3ZoLXV4L21hbmFnZXItdGVzdHMtc2V0dXAnO1xuXG5leHBvcnQgZGVmYXVsdCBtZXJnZUNvbmZpZyhcbiAgc2hhcmVkQ29uZmlnLFxuICBjcmVhdGVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtcbiAgICAgIHJlYWN0KCksXG4gICAgICBzdmdyKHtcbiAgICAgICAgaW5jbHVkZTogJyoqLyouc3ZnJyxcbiAgICAgIH0pLFxuICAgIF0sXG4gICAgdGVzdDoge1xuICAgICAgY292ZXJhZ2U6IHtcbiAgICAgICAgZXhjbHVkZTogWy4uLmRlZmF1bHRFeGNsdWRlZEZpbGVzXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByZXNvbHZlOiB7XG4gICAgICBhbGlhczoge1xuICAgICAgICAnQC9wdWJsaWMnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAncHVibGljJyksXG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgfSxcbiAgICB9LFxuICB9KSxcbik7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFiLE9BQU8sVUFBVTtBQUN0YyxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCO0FBQUEsRUFDRTtBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQUEsRUFDQTtBQUFBLE9BQ0s7QUFSUCxJQUFNLG1DQUFtQztBQVV6QyxJQUFPLHdCQUFRO0FBQUEsRUFDYjtBQUFBLEVBQ0EsYUFBYTtBQUFBLElBQ1gsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLE1BQ04sS0FBSztBQUFBLFFBQ0gsU0FBUztBQUFBLE1BQ1gsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLE1BQU07QUFBQSxNQUNKLFVBQVU7QUFBQSxRQUNSLFNBQVMsQ0FBQyxHQUFHLG9CQUFvQjtBQUFBLE1BQ25DO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsT0FBTztBQUFBLFFBQ0wsWUFBWSxLQUFLLFFBQVEsa0NBQVcsUUFBUTtBQUFBLFFBQzVDLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxNQUNwQztBQUFBLElBQ0Y7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFtdCn0K
