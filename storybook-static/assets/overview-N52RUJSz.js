import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-BenGHN5L.js";import{S as s}from"./index-C29aiW5g.js";import{M as t}from"./index-EQhVOb-2.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-BHu8F3gw.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function r(i){const e={code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...l(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(t,{title:"Core/vite-config/Overview"}),`
`,n.jsx(e.h1,{id:"vite-configuration",children:"Vite Configuration"}),`
`,n.jsx(e.p,{children:"The Vite Configuration module provides a standardized build and development setup for OVHcloud Manager applications. It includes pre-configured plugins, development server settings, and build optimizations specifically designed for the OVHcloud ecosystem."}),`
`,n.jsx(s,{label:"Overview",level:2}),`
`,n.jsx(e.p,{children:"The configuration provides a comprehensive setup for OVHcloud applications:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Development Server"}),": Pre-configured development server with proxy settings"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Build Optimization"}),": Optimized production builds with legacy support"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Plugin Integration"}),": Essential plugins for React, SVG, and static assets"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Environment Support"}),": Support for different environments (EU, LABEU)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Container Support"}),": Special handling for container applications"]}),`
`]}),`
`,n.jsx(s,{label:"Key Features",level:2}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"React Support"}),": Built-in React plugin configuration"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Legacy Browser Support"}),": Automatic legacy browser compatibility"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Development Server"}),": Integrated proxy and SSO support"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Asset Handling"}),": SVG and static file handling"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Environment Configuration"}),": Flexible environment-specific settings"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Hot Module Replacement"}),": Enhanced HMR with iframe support"]}),`
`]}),`
`,n.jsx(s,{label:"Usage",level:2}),`
`,n.jsx(e.h3,{id:"installation",children:"Installation"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`yarn add @ovh-ux/manager-vite-config
`})}),`
`,n.jsx(e.h3,{id:"basic-setup",children:"Basic Setup"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`// vite.config.js
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default getBaseConfig({
  // Optional configuration
  isLABEU: false,
  local2API: false,
});
`})}),`
`,n.jsx(e.h3,{id:"available-configuration-options",children:"Available Configuration Options"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`interface ViteConfig {
  local2API?: boolean;      // Enable local API proxy
  isLABEU?: boolean;        // Enable LABEU environment
  host?: string;           // Custom host configuration
  devLoginUrl?: string;    // Custom login URL
  baseUrl?: string;        // Custom base URL
  authURL?: string;        // Custom auth URL
  proxy?: {
    host: string;         // Proxy host configuration
  };
}
`})}),`
`,n.jsx(e.h3,{id:"development-server-features",children:"Development Server Features"}),`
`,n.jsx(e.p,{children:"The development server includes:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"SSO Integration"}),": Automatic SSO authentication handling"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"API Proxying"}),": Proxy configuration for API endpoints"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Container Support"}),": Special handling for container applications"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Custom Proxy"}),": Support for custom proxy configurations"]}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`// dev.proxy.config.mjs
export default {
  context: '/api',
  target: 'http://localhost:3000',
  changeOrigin: true,
};
`})}),`
`,n.jsx(s,{label:"Best Practices",level:2}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Environment Configuration"}),":"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use appropriate environment settings"}),`
`,n.jsx(e.li,{children:"Configure LABEU environment when needed"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`export default getBaseConfig({
  isLABEU: process.env.LABEU === 'true',
});
`})}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Development Server"}),":"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use the built-in proxy for API calls"}),`
`,n.jsx(e.li,{children:"Configure custom proxies when needed"}),`
`,n.jsx(e.li,{children:"Handle SSO authentication properly"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Build Optimization"}),":"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Enable source maps in development"}),`
`,n.jsx(e.li,{children:"Use production optimizations in builds"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`export default getBaseConfig({
  build: {
    sourcemap: process.env.NODE_ENV === 'development',
  },
});
`})}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Asset Management"}),":"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use the built-in SVG plugin"}),`
`,n.jsx(e.li,{children:"Configure static file copying"}),`
`,n.jsx(e.li,{children:"Handle translations properly"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Container Applications"}),":"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Set appropriate base URL"}),`
`,n.jsx(e.li,{children:"Configure container-specific settings"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`export default getBaseConfig({
  base: process.env.CONTAINER ? '/app/' : './',
});
`})}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"Performance"}),":"]}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use appropriate build settings"}),`
`,n.jsx(e.li,{children:"Configure proper caching"}),`
`,n.jsx(e.li,{children:"Optimize for production"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`export default getBaseConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
});
`})}),`
`]}),`
`]})]})}function f(i={}){const{wrapper:e}={...l(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(r,{...i})}):r(i)}export{f as default};
