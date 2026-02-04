import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-JTD1cOSY.js";import{M as r}from"./index-BOVma5jo.js";import"./index-Bnop-kX6.js";import"./iframe-COCNz2cq.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(s){const e={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...s.components};return n.jsxs(n.Fragment,{children:[n.jsx(r,{title:"Guidelines/Launch test with MUK"}),`
`,n.jsx(e.h1,{id:"running-tests-with-manager-ui-kit",children:"Running Tests with Manager UI Kit"}),`
`,n.jsx(e.h2,{id:"quick-setup",children:"Quick Setup"}),`
`,n.jsxs(e.p,{children:["To run Vitest tests with Manager UI Kit (MUK), use the ",n.jsx(e.code,{children:"sharedCssConfig"})," configuration."]}),`
`,n.jsx(e.h2,{id:"configuration",children:"Configuration"}),`
`,n.jsxs(e.p,{children:["Import and spread ",n.jsx(e.code,{children:"sharedCssConfig"})," in your test configuration:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`import {
  createConfig,
  mergeConfig,
  sharedConfig,
  sharedCssConfig,
} from '@ovh-ux/manager-tests-setup';

export default mergeConfig(
  sharedConfig,
  createConfig({
    test: {
      setupFiles: ['./setupTests.ts'],
      ...sharedCssConfig,
    },
  }),
);
`})}),`
`,n.jsxs(e.h2,{id:"what-does-sharedcssconfig-include",children:["What does ",n.jsx(e.code,{children:"sharedCssConfig"})," include?"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-javascript",children:`{
  deps: {
    inline: ['@ovhcloud/ods-react'],  // Transform ODS components during tests
  },
  css: true,                   // Enable CSS processing for styled components
}
`})}),`
`,n.jsx(e.h2,{id:"why-is-this-needed",children:"Why is this needed?"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:n.jsx(e.code,{children:"deps.inline"})})," - Ensures ODS React components are properly transformed and rendered"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:n.jsx(e.code,{children:"css: true"})})," - Enables component styling in tests"]}),`
`]}),`
`,n.jsx(e.p,{children:"That's it! Your tests will now work with MUK components."})]})}function g(s={}){const{wrapper:e}={...i(),...s.components};return e?n.jsx(e,{...s,children:n.jsx(t,{...s})}):t(s)}export{g as default};
