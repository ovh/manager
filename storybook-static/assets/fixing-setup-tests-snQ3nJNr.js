import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-D9W7WIyf.js";import{M as r}from"./index-CkYkztty.js";import"./index-Bnop-kX6.js";import"./iframe-BRkcAREb.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(i){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Manager UI Kit/What's new/Common issues/Fixing setup tests"}),`
`,e.jsx(n.h1,{id:"fixing-test-setup-configuration",children:"Fixing Test Setup Configuration"}),`
`,e.jsx(n.p,{children:"This guide helps you configure your test environment correctly when using Manager UI Kit (MUK) with different component library combinations."}),`
`,e.jsx(n.h2,{id:"supported-implementation-scenarios",children:"Supported Implementation Scenarios"}),`
`,e.jsx(n.p,{children:"MUK supports several implementation configurations depending on your project requirements:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"MUK only"})," - Pure Manager UI Kit implementation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"MUK + ODS19"})," - MUK with OVHcloud Design System v19"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"MUK + ODS19 + MRCV2 + ODS18"})," - Mixed ODS versions with Manager React Components v2"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"MUK + ODS18 + MRCV2"})," - Legacy ODS v18 with Manager React Components v2"]}),`
`]}),`
`,e.jsx(n.h2,{id:"configuration-steps",children:"Configuration Steps"}),`
`,e.jsx(n.h3,{id:"step-1-update-required-dependencies",children:"Step 1: Update Required Dependencies"}),`
`,e.jsxs(n.p,{children:["Ensure your ",e.jsx(n.code,{children:"package.json"})," includes the latest versions of the following core dependencies:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "dependencies": {
    "@ovh-ux/manager-core-utils": "^0.5.0",
    "@ovh-ux/ovh-at-internet": "^0.29.0",
    "@ovh-ux/shell": "^4.10.0",
    "@ovh-ux/manager-tests-setup": "^0.7.0",
    "@ovh-ux/manager-core-api": "^0.21.0",
    "@ovh-ux/manager-react-core-application": "^0.14.0",
    "@ovh-ux/ovh-product-icons": "^0.15.0",
    "@ovh-ux/request-tagger": "^0.6.0",
    "@ovh-ux/manager-core-sso": "^0.7.0",
    "@ovh-ux/url-builder": "^2.4.0",
    "@ovh-ux/manager-core-utils": "^0.5.0"
    "@ovh-ux/manager-react-shell-client": "^1.0.2"
  }
}
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Why these versions?"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"These packages contain critical fixes for test environment compatibility"}),`
`,e.jsx(n.li,{children:"They provide proper ESM/CJS module resolution"}),`
`,e.jsx(n.li,{children:"They ensure correct handling of React 18 features in tests"}),`
`]}),`
`,e.jsx(n.h3,{id:"step-2-configure-vitest",children:"Step 2: Configure Vitest"}),`
`,e.jsxs(n.p,{children:["Update your ",e.jsx(n.code,{children:"vitest.config.js"})," (or ",e.jsx(n.code,{children:"vitest.config.ts"}),") with the following configuration:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  INLINE_DEPS,
  NO_EXTERNAL_DEPS,
  createConfig,
  defaultDedupedDependencies,
  defaultExcludedFiles,
  mergeConfig,
  sharedConfig,
  stubStylesPlugin,
} from '@ovh-ux/manager-tests-setup';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default mergeConfig(
  sharedConfig,
  createConfig({
    // Plugins configuration
    plugins: [...(sharedConfig.plugins ?? []), stubStylesPlugin()],
    
    test: {
      // Setup file for global test configuration
      setupFiles: ['./setupTests.ts'],
      
      // Dependencies that should be processed by Vitest (not pre-bundled)
      deps: {
        inline: INLINE_DEPS,
      },
      
      // Server-side dependency handling
      server: {
        deps: {
          inline: INLINE_DEPS,
        },
      },
      
      // Coverage configuration
      coverage: {
        exclude: [
          ...defaultExcludedFiles,
          // App-specific exclusions:
          'vite-*.ts',           // Vite configuration files
          'App.tsx',             // Root application component
          'core/ShellRoutingSync.tsx',  // Shell routing integration
          'main.tsx',            // Application entry point
          'routes.tsx',          // Route definitions
          '__mocks__',           // Mock files
          'queryClient.ts',      // React Query client setup
        ],
      },
    },
    
    // SSR configuration - prevents external dependencies from being bundled
    ssr: {
      noExternal: NO_EXTERNAL_DEPS,
    },
    
    // Module resolution configuration
    resolve: {
      // Prevent duplicate module instances
      dedupe: [...defaultDedupedDependencies],
      
      // Path alias for cleaner imports
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  }),
);
`})}),`
`,e.jsx(n.h2,{id:"configuration-breakdown",children:"Configuration Breakdown"}),`
`,e.jsx(n.h3,{id:"inline_deps",children:e.jsx(n.code,{children:"INLINE_DEPS"})}),`
`,e.jsx(n.p,{children:"Forces certain dependencies to be transformed by Vitest rather than pre-bundled. This is essential for:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"ESM-only packages"}),`
`,e.jsx(n.li,{children:"Packages that need to be instrumented for coverage"}),`
`,e.jsx(n.li,{children:"MUK and related OVHcloud packages"}),`
`]}),`
`,e.jsx(n.h3,{id:"no_external_deps",children:e.jsx(n.code,{children:"NO_EXTERNAL_DEPS"})}),`
`,e.jsx(n.p,{children:"Prevents Vitest from treating certain packages as external during SSR testing. Required for:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"React components that need server-side rendering"}),`
`,e.jsx(n.li,{children:"Packages that contain both client and server code"}),`
`]}),`
`,e.jsx(n.h3,{id:"stubstylesplugin",children:e.jsx(n.code,{children:"stubStylesPlugin()"})}),`
`,e.jsx(n.p,{children:"Automatically stubs CSS/SCSS imports during tests to prevent style-related errors in the test environment."}),`
`,e.jsx(n.h3,{id:"defaultdedupeddependencies",children:e.jsx(n.code,{children:"defaultDedupedDependencies"})}),`
`,e.jsx(n.p,{children:"Ensures packages like React, React DOM, and ODS components are loaded only once, preventing:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'"Invalid hook call" errors'}),`
`,e.jsx(n.li,{children:"Context provider mismatches"}),`
`,e.jsx(n.li,{children:"Multiple React instances"}),`
`]})]})}function g(i={}){const{wrapper:n}={...s(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(t,{...i})}):t(i)}export{g as default};
