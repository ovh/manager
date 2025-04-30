// vite.config.mjs
import { defineConfig } from "file:///Users/aboungna/Documents/react/manager/node_modules/.pnpm/vite@5.4.18_@types+node@20.14.10_less@3.13.1_sass@1.56.1_sugarss@2.0.0_terser@5.39.0/node_modules/vite/dist/node/index.js";
import path from "path";
import dts from "file:///Users/aboungna/Documents/react/manager/node_modules/.pnpm/vite-plugin-dts@3.5.1_@types+node@20.14.10_rollup@4.35.0_typescript@5.8.2_vite@5.4.18_@_b634b7a3b7758be1d424ef01d5afe7e1/node_modules/vite-plugin-dts/dist/index.mjs";
import { viteStaticCopy } from "file:///Users/aboungna/Documents/react/manager/node_modules/.pnpm/vite-plugin-static-copy@2.3.0_vite@5.4.18_@types+node@20.14.10_less@3.13.1_sass@1.56.1_sugarss@2.0.0_terser@5.39.0_/node_modules/vite-plugin-static-copy/dist/index.js";
var __vite_injected_original_dirname = "/Users/aboungna/Documents/react/manager/packages/manager/modules/common-translations";
var pathSrc = path.resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig({
  root: path.resolve(process.cwd(), "src"),
  resolve: {
    alias: {
      "@/": pathSrc
    }
  },
  plugins: [
    dts({
      root: __vite_injected_original_dirname,
      outDir: "dist/types",
      insertTypesEntry: true
    }),
    viteStaticCopy({
      targets: [
        {
          src: `../public/translations/**/`,
          dest: "@ovh-ux/manager-common-translations"
        }
      ]
    })
  ],
  build: {
    outDir: path.resolve(__vite_injected_original_dirname, "dist"),
    emptyOutDir: true,
    lib: {
      entry: path.resolve(pathSrc, "index.ts"),
      name: "ManagerCommonTranslations",
      formats: ["esm", "cjs"],
      fileName: (format) => `index.${format}.js`
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2Fib3VuZ25hL0RvY3VtZW50cy9yZWFjdC9tYW5hZ2VyL3BhY2thZ2VzL21hbmFnZXIvbW9kdWxlcy9jb21tb24tdHJhbnNsYXRpb25zXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYWJvdW5nbmEvRG9jdW1lbnRzL3JlYWN0L21hbmFnZXIvcGFja2FnZXMvbWFuYWdlci9tb2R1bGVzL2NvbW1vbi10cmFuc2xhdGlvbnMvdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9hYm91bmduYS9Eb2N1bWVudHMvcmVhY3QvbWFuYWdlci9wYWNrYWdlcy9tYW5hZ2VyL21vZHVsZXMvY29tbW9uLXRyYW5zbGF0aW9ucy92aXRlLmNvbmZpZy5tanNcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5pbXBvcnQgeyB2aXRlU3RhdGljQ29weSB9IGZyb20gJ3ZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5JztcblxuY29uc3QgcGF0aFNyYyA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcm9vdDogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICdzcmMnKSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQC8nOiBwYXRoU3JjLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6W1xuICAgIGR0cyh7XG4gICAgICByb290OiBfX2Rpcm5hbWUsXG4gICAgICBvdXREaXI6ICdkaXN0L3R5cGVzJyxcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXG4gICAgfSksXG4gICAgdml0ZVN0YXRpY0NvcHkoe1xuICAgICAgdGFyZ2V0czogW1xuICAgICAgICB7XG4gICAgICAgICAgc3JjOiBgLi4vcHVibGljL3RyYW5zbGF0aW9ucy8qKi9gLFxuICAgICAgICAgIGRlc3Q6ICdAb3ZoLXV4L21hbmFnZXItY29tbW9uLXRyYW5zbGF0aW9ucycsXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0pLFxuICBdLFxuICBidWlsZDoge1xuICAgIG91dERpcjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ2Rpc3QnKSxcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUocGF0aFNyYywgJ2luZGV4LnRzJyksXG4gICAgICBuYW1lOiAnTWFuYWdlckNvbW1vblRyYW5zbGF0aW9ucycsXG4gICAgICBmb3JtYXRzOiBbJ2VzbScsICdjanMnXSxcbiAgICAgIGZpbGVOYW1lOiAoZm9ybWF0KSA9PiBgaW5kZXguJHtmb3JtYXR9LmpzYCxcbiAgICB9XG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFVBQVU7QUFDakIsT0FBTyxTQUFTO0FBQ2hCLFNBQVMsc0JBQXNCO0FBSi9CLElBQU0sbUNBQW1DO0FBTXpDLElBQU0sVUFBVSxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUU3QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNLEtBQUssUUFBUSxRQUFRLElBQUksR0FBRyxLQUFLO0FBQUEsRUFDdkMsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsTUFBTTtBQUFBLElBQ1I7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFRO0FBQUEsSUFDTixJQUFJO0FBQUEsTUFDRixNQUFNO0FBQUEsTUFDTixRQUFRO0FBQUEsTUFDUixrQkFBa0I7QUFBQSxJQUNwQixDQUFDO0FBQUEsSUFDRCxlQUFlO0FBQUEsTUFDYixTQUFTO0FBQUEsUUFDUDtBQUFBLFVBQ0UsS0FBSztBQUFBLFVBQ0wsTUFBTTtBQUFBLFFBQ1I7QUFBQSxNQUNGO0FBQUEsSUFDRixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUSxLQUFLLFFBQVEsa0NBQVcsTUFBTTtBQUFBLElBQ3RDLGFBQWE7QUFBQSxJQUNiLEtBQUs7QUFBQSxNQUNILE9BQU8sS0FBSyxRQUFRLFNBQVMsVUFBVTtBQUFBLE1BQ3ZDLE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxPQUFPLEtBQUs7QUFBQSxNQUN0QixVQUFVLENBQUMsV0FBVyxTQUFTLE1BQU07QUFBQSxJQUN2QztBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
