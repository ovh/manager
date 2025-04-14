import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as s,b as i}from"./index-BYr1Q8vH.js";import{useMDXComponents as o}from"./index-C-_6Vi3R.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./iframe-B96g4wcp.js";import"../sb-preview/runtime.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";function n(t){const r=Object.assign({h2:"h2",p:"p",code:"code",ul:"ul",li:"li",ol:"ol"},o(),t.components);return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Hooks/useBreadcrumb"}),`
`,e.jsx(r.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(r.p,{children:["The ",e.jsx(r.code,{children:"useBreadcrumb"})," custom React hook is designed to dynamically generate a breadcrumb trail for navigation within an application. It leverages React Router's ",e.jsx(r.code,{children:"useLocation"})," to track the current route and a context (",e.jsx(r.code,{children:"ShellContext"}),") to fetch navigation URLs. This hook simplifies breadcrumb management, providing a consistent structure for routing in applications using the OVH Manager Shell."]}),`
`,e.jsx(r.h2,{id:"key-features",children:"Key Features"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsx(r.li,{children:"Automatically resolves the root breadcrumb using the OVH Manager Shell's navigation API."}),`
`,e.jsx(r.li,{children:"Dynamically generates breadcrumb paths based on the current route."}),`
`]}),`
`,e.jsx(r.h2,{id:"usage",children:"Usage"}),`
`,e.jsxs(r.p,{children:["To use ",e.jsx(r.code,{children:"useBreadcrumb"}),", follow these steps:"]}),`
`,e.jsxs(r.ol,{children:[`
`,e.jsxs(r.li,{children:["Ensure that your application is wrapped with ",e.jsx(r.code,{children:"ShellContext"})," and uses React Router."]}),`
`,e.jsxs(r.li,{children:["Import and use the ",e.jsx(r.code,{children:"useBreadcrumb"})," hook in your component."]}),`
`]}),`
`,e.jsx(i,{code:`
import React from 'react';
import { useBreadcrumb } from './useBreadcrumb';

const MyComponent = () => {
const breadcrumbs = useBreadcrumb({
rootLabel: 'vRack services',
appName: 'vrack-services',
});
`,language:"javascript"})]})}function g(t={}){const{wrapper:r}=Object.assign({},o(),t.components);return r?e.jsx(r,Object.assign({},t,{children:e.jsx(n,t)})):n(t)}export{g as default};
