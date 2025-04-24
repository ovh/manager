import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as s,b as r}from"./index-DHRn6AGu.js";import{useMDXComponents as i}from"./index-C-_6Vi3R.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./iframe-BlIAnhRS.js";import"../sb-preview/runtime.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";function t(n){const o=Object.assign({h1:"h1",h2:"h2",p:"p",code:"code",strong:"strong",h3:"h3",h4:"h4"},i(),n.components);return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Templates/ErrorBoundary/Documentation"}),`
`,e.jsx(o.h1,{id:"errorboundary",children:"ErrorBoundary"}),`
`,e.jsx(o.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(o.p,{children:["The ",e.jsx(o.code,{children:"ErrorBoundary"})," component is designed to handle errors occurring in routed components inside a ",e.jsx(o.strong,{children:"React Router"})," application. It leverages ",e.jsx(o.code,{children:"useRouteError"})," from ",e.jsx(o.code,{children:"react-router-dom"})," to capture errors and display an ",e.jsx(o.code,{children:"ErrorBanner"}),"."]}),`
`,e.jsxs(o.p,{children:["This component also integrates with ",e.jsx(o.code,{children:"ShellContext"})," from ",e.jsx(o.code,{children:"@ovh-ux/manager-react-shell-client"})," to provide navigation functions such as ",e.jsx(o.strong,{children:"reloading the page"})," or ",e.jsx(o.strong,{children:"redirecting to a specific app"}),"."]}),`
`,e.jsx(o.h2,{id:"usage",children:"Usage"}),`
`,e.jsx(o.h3,{id:"importing-the-component-in-your-routestsx-file",children:"Importing the Component in your routes.tsx file"}),`
`,e.jsx(o.h4,{id:"with-lazyrouteconfig-function",children:"With LazyRouteConfig function"}),`
`,e.jsx(r,{code:`import { ErrorBoundary } from '@ovh-ux/manager-react-components';

        const lazyRouteConfig = (importFn: CallableFunction) => ({
            lazy: async () => {
              const { default: moduleDefault, ...moduleExports } = await importFn();
              return {
                Component: moduleDefault,
                ...moduleExports,
              };
          },
          // Just add this following line and fill the redirectionApp
          errorElement: <ErrorBoundary redirectionApp="key-management-service" />
      });`,language:"typescript"}),`
`,e.jsx(o.h4,{id:"with-route-component",children:"With Route component"}),`
`,e.jsx(r,{code:`import { ErrorBoundary } from '@ovh-ux/manager-react-components';
  <Route
    id="root"
    path={ROUTE_PATHS.ROOT}
    Component={LayoutPage}
    // Just add this following line and fill the redirectionApp
    errorElement={<ErrorBoundary redirectionApp="key-management-service" />}
  >
    <Route path="notFound" element={<>Page not found</>}></Route>
`,language:"typescript"})]})}function f(n={}){const{wrapper:o}=Object.assign({},i(),n.components);return o?e.jsx(o,Object.assign({},n,{children:e.jsx(t,n)})):t(n)}export{f as default};
