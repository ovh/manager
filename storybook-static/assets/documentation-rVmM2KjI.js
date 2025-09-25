import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-DMscLk_r.js";import{M as a,S as r}from"./index-KONHwz82.js";import"./index-Bnop-kX6.js";import"./iframe-D56x9By5.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(n){const o={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",p:"p",strong:"strong",...i(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Manager React Components/Templates/ErrorBoundary/Documentation"}),`
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
`,language:"typescript"})]})}function g(n={}){const{wrapper:o}={...i(),...n.components};return o?e.jsx(o,{...n,children:e.jsx(t,{...n})}):t(n)}export{g as default};
