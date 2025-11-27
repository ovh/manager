import path from "path";
import {
  sharedConfig,
  mergeConfig,
  createConfig, 
  defaultExcludedFiles
} from "@ovh-ux/manager-tests-setup";

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ["./src/__tests__/setupTest.ts"],
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions (not in shared config):
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
        "@": path.resolve(__dirname, "src")
      }
    }
  })
);
