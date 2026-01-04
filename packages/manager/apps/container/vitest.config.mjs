import path from "path";
import {
  sharedConfig,
  mergeConfig,
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
} from "@ovh-ux/manager-tests-setup";

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
      coverage: {
        exclude: [...defaultExcludedFiles],
      },
    },
    resolve: { dedupe: [...defaultDedupedDependencies],
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
  }),
);
