import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-CUIskjj6.js";import{M as t}from"./index-BRK_XPYQ.js";import"./index-Bnop-kX6.js";import"./iframe-Bmn67lXx.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(r){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...a(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Manager UI Kit/What's new/Common issues/Install MUK error"}),`
`,e.jsx(n.h1,{id:"install-muk-error",children:"Install MUK error"}),`
`,e.jsx(n.h2,{id:"peer-dependencies-required",children:"Peer Dependencies Required"}),`
`,e.jsxs(n.p,{children:["When you install and import ",e.jsx(n.code,{children:"@ovh-ux/muk"})," in your project, you must also install all its ",e.jsx(n.strong,{children:"peer dependencies"}),". These are external packages that MUK depends on but doesn't bundle directly."]}),`
`,e.jsx(n.h3,{id:"why-peer-dependencies",children:"Why Peer Dependencies?"}),`
`,e.jsx(n.p,{children:"Peer dependencies ensure:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Version consistency"})," across your application"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Reduced bundle size"})," by avoiding duplicate dependencies"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Compatibility"})," between MUK and your project's existing dependencies"]}),`
`]}),`
`,e.jsx(n.h3,{id:"required-peer-dependencies",children:"Required Peer Dependencies"}),`
`,e.jsxs(n.p,{children:["The following packages must be installed alongside ",e.jsx(n.code,{children:"@ovh-ux/muk"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`{
  "@ovh-ux/manager-common-translations": "*",
  "@ovh-ux/manager-config": "^8.8.0",
  "@ovh-ux/manager-core-api": "^0.10.0",
  "@ovh-ux/manager-core-utils": "*",
  "@ovh-ux/manager-react-shell-client": "^0.11.2",
  "@ovhcloud/ods-react": "19.2.1",
  "@ovhcloud/ods-themes": "19.2.1",
  "@tanstack/react-query": "^5.51.21",
  "@tanstack/react-table": "8.11.8",
  "@tanstack/react-virtual": "^3.10.9",
  "date-fns": "~4.1.0",
  "i18next": "^23.8.2",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-i18next": "^14.0.5",
  "react-router-dom": "^6.3.0",
  "react-use": "^17.5.0",
  "zustand": "^4.5.5"
}
`})}),`
`,e.jsx(n.h3,{id:"installation",children:"Installation"}),`
`,e.jsx(n.h4,{id:"using-pnpm",children:"Using pnpm"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`pnpm add @ovh-ux/muk
pnpm add @ovh-ux/manager-common-translations @ovh-ux/manager-config @ovh-ux/manager-core-api @ovh-ux/manager-core-utils @ovh-ux/manager-react-shell-client @ovhcloud/ods-react @ovhcloud/ods-themes @tanstack/react-query @tanstack/react-table @tanstack/react-virtual date-fns i18next react react-dom react-i18next react-router-dom react-use zustand
`})}),`
`,e.jsx(n.h4,{id:"using-yarn",children:"Using yarn"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`yarn add @ovh-ux/muk
yarn add @ovh-ux/manager-common-translations @ovh-ux/manager-config @ovh-ux/manager-core-api @ovh-ux/manager-core-utils @ovh-ux/manager-react-shell-client @ovhcloud/ods-react @ovhcloud/ods-themes @tanstack/react-query @tanstack/react-table @tanstack/react-virtual date-fns i18next react react-dom react-i18next react-router-dom react-use zustand
`})}),`
`,e.jsx(n.h3,{id:"common-errors",children:"Common Errors"}),`
`,e.jsx(n.p,{children:"If you see errors like:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Cannot find module '@ovhcloud/ods-react'"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Module not found: Can't resolve 'react-i18next'"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Peer dependency warnings"})}),`
`]}),`
`,e.jsx(n.p,{children:"This means you're missing one or more peer dependencies. Install all the packages listed above to resolve these issues."}),`
`,e.jsx(n.h3,{id:"verifying-installation",children:"Verifying Installation"}),`
`,e.jsxs(n.p,{children:["After installation, verify that all peer dependencies are properly installed by checking your ",e.jsx(n.code,{children:"package.json"})," file. All the packages listed above should appear in your ",e.jsx(n.code,{children:"dependencies"})," section."]})]})}function m(r={}){const{wrapper:n}={...a(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(s,{...r})}):s(r)}export{m as default};
