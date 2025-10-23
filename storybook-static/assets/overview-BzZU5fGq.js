import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-Ci5cnJnU.js";import{S as l,a as r}from"./index-DQ1YbaPq.js";import{M as o}from"./index-CXO9AQ-9.js";import"./index-Bnop-kX6.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react94-Bxf0SjVg.js";import"./iframe-ClZwXGXb.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(i){const n={code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Core/manager-react-shell-client/Overview"}),`
`,e.jsx(n.h1,{id:"manager-shell-client",children:"Manager Shell Client"}),`
`,e.jsx(n.p,{children:"The Manager Shell Client is a React-based integration layer that provides access to the OVHcloud Manager Shell functionality within React applications. It offers a set of hooks and context providers to interact with the shell's features."}),`
`,e.jsx(l,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"The shell client provides a React context-based approach to access shell functionality. It includes:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Shell context for accessing shell features"}),`
`,e.jsx(n.li,{children:"Environment configuration"}),`
`,e.jsx(n.li,{children:"Navigation capabilities"}),`
`,e.jsx(n.li,{children:"Routing utilities"}),`
`,e.jsx(n.li,{children:"UX features"}),`
`,e.jsx(n.li,{children:"Tracking functionality"}),`
`]}),`
`,e.jsx(l,{label:"Key Features",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Shell Context"}),": Provides access to shell functionality through React context"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Environment Management"}),": Access to environment configuration"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Navigation"}),": Shell navigation capabilities"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Routing"}),": Shell routing utilities"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"UX Features"}),": Access to shell UX functionality"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tracking"}),": Shell tracking capabilities"]}),`
`]}),`
`,e.jsx(l,{label:"Usage",level:2}),`
`,e.jsx(n.h3,{id:"basic-setup",children:"Basic Setup"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { ShellContext, initShellContext } from '@ovh-ux/manager-react-shell-client';

// Initialize shell context
const { shell, environment, tracking } = await initShellContext('your-app-name', {
  chapter1: 'your-chapter',
  chapter2: 'your-subchapter',
  appName: 'your-app-name'
});

// Use in your app
function App() {
  return (
    <ShellContext.Provider value={{ shell, environment, tracking }}>
      {/* Your app components */}
    </ShellContext.Provider>
  );
}
`})}),`
`,e.jsx(n.h3,{id:"accessing-shell-features",children:"Accessing Shell Features"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function YourComponent() {
  const { shell, environment } = useContext(ShellContext);
  
  // Access shell features
  const navigation = shell.navigation;
  const routing = shell.routing;
  const ux = shell.ux;
  const tracking = shell.tracking;
  
  return (
    // Your component JSX
  );
}
`})}),`
`,e.jsx(l,{label:"Best Practices",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Use ShellContext Directly"}),": The hooks (",e.jsx(n.code,{children:"useShell"}),", ",e.jsx(n.code,{children:"useNavigation"}),", ",e.jsx(n.code,{children:"useRouting"}),", etc.) are deprecated. Use the ",e.jsx(n.code,{children:"ShellContext"})," directly instead."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Initialize Early"}),": Initialize the shell context as early as possible in your application lifecycle."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Type Safety"}),": Take advantage of TypeScript types provided by the library for better type safety."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Error Handling"}),": Always handle potential errors when initializing the shell context."]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Performance"}),": Access shell features only when needed to avoid unnecessary re-renders."]}),`
`]}),`
`]}),`
`,e.jsx(r,{children:e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Always provide proper tracking parameters when initializing the shell context"}),`
`,e.jsx(n.li,{children:"Use environment variables for configuration"}),`
`,e.jsx(n.li,{children:"Handle shell initialization errors gracefully"}),`
`,e.jsx(n.li,{children:"Keep shell context at the root level of your application"}),`
`]})})]})}function S(i={}){const{wrapper:n}={...s(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(t,{...i})}):t(i)}export{S as default};
