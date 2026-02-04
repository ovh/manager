import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-g6nCrg6v.js";import{M as o}from"./index-CFQnl7m9.js";import"./index-Bnop-kX6.js";import"./iframe-CaW5sJsF.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(e){const i={code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...e.components};return n.jsxs(n.Fragment,{children:[n.jsx(o,{title:"Manager UI Kit/What's new/Common issues/Correct tailwind issues"}),`
`,n.jsx(i.h1,{id:"import-style-files",children:"Import style files"}),`
`,n.jsx(i.h2,{id:"import-order",children:"Import Order"}),`
`,n.jsxs(i.p,{children:["The order of CSS imports is ",n.jsx(i.strong,{children:"very important"}),". The ",n.jsx(i.code,{children:"@ovh-ux/muk/dist/style.css"})," file should be imported after ODS styles import to avoid side effects with Tailwind configuration."]}),`
`,n.jsx(i.h3,{id:"correct-import-order",children:"Correct Import Order"}),`
`,n.jsx(i.pre,{children:n.jsx(i.code,{className:"language-index.scss",children:`@tailwind utilities;
@import '@ovhcloud/ods-themes/default';
@import '@ovh-ux/muk/dist/style.css';
`})}),`
`,n.jsx(i.h3,{id:"why-this-matters",children:"Why This Matters"}),`
`,n.jsx(i.p,{children:"Importing MUK styles last ensures that:"}),`
`,n.jsxs(i.ul,{children:[`
`,n.jsx(i.li,{children:"Tailwind utilities are properly applied"}),`
`,n.jsx(i.li,{children:"ODS themes are correctly loaded"}),`
`,n.jsx(i.li,{children:"MUK styles don't interfere with Tailwind configuration"}),`
`,n.jsx(i.li,{children:"No unexpected side effects occur in your styling"}),`
`]}),`
`,n.jsxs(i.p,{children:[n.jsx(i.strong,{children:"Important"}),": Always import ",n.jsx(i.code,{children:"@ovh-ux/muk/dist/style.css"})," as the final CSS import in your main stylesheet."]}),`
`,n.jsx(i.h2,{id:"tailwind-configuration",children:"Tailwind Configuration"}),`
`,n.jsxs(i.p,{children:["Don't forget to configure your ",n.jsx(i.code,{children:"tailwind.config.mjs"})," to include ",n.jsx(i.code,{children:"@ovh-ux/muk"})," in the ",n.jsx(i.code,{children:"content"})," attributes. This ensures Tailwind can scan MUK components for utility classes."]}),`
`,n.jsx(i.h3,{id:"example-configuration",children:"Example Configuration"}),`
`,n.jsx(i.pre,{children:n.jsx(i.code,{className:"language-tailwind.config.mjs",children:`import { createRequire } from 'node:module';
import path from 'node:path';

import baseConfig from '@ovh-ux/manager-tailwind-config';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(\`\${name}/package.json\`));
const toGlob = (dir) =>
  \`\${dir.replace(/\\\\/g, '/')}/**/*.{js,jsx,ts,tsx,cjs,mjs}\`;

const reactComponentsDir = pkgDir('@ovh-ux/muk');

const baseTailwindConfig = [
  ...(baseConfig.content ?? []),
  './src/**/*.{js,jsx,ts,tsx}',
  toGlob(reactComponentsDir),
];

export const pciTailwindConfig = [...baseTailwindConfig];

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: baseTailwindConfig,
  corePlugins: {
    preflight: false,
  },
};
`})}),`
`,n.jsx(i.h3,{id:"key-points",children:"Key Points"}),`
`,n.jsxs(i.ul,{children:[`
`,n.jsxs(i.li,{children:["Use ",n.jsx(i.code,{children:"pkgDir('@ovh-ux/muk')"})," to get the MUK package directory"]}),`
`,n.jsxs(i.li,{children:["Convert it to a glob pattern using ",n.jsx(i.code,{children:"toGlob()"})," function"]}),`
`,n.jsxs(i.li,{children:["Add it to your ",n.jsx(i.code,{children:"content"})," array in the Tailwind config"]}),`
`,n.jsx(i.li,{children:"This allows Tailwind to properly scan MUK components for utility classes"}),`
`]}),`
`,n.jsxs(i.p,{children:[n.jsx(i.strong,{children:"Important"}),": Without this configuration, Tailwind won't be able to detect utility classes used in MUK components, which may result in missing styles in production builds."]})]})}function u(e={}){const{wrapper:i}={...s(),...e.components};return i?n.jsx(i,{...e,children:n.jsx(t,{...e})}):t(e)}export{u as default};
