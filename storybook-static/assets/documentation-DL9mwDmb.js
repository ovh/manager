import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-D_1QkM3g.js";import{M as s,S as a}from"./index-26vOBqU-.js";import"./index-Bnop-kX6.js";import"./iframe-BboHc1zZ.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(n){const r={code:"code",h2:"h2",li:"li",ol:"ol",p:"p",ul:"ul",...o(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Manager React Components/Hooks/useBreadcrumb"}),`
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
`,e.jsx(a,{code:`
import React from 'react';
import { useBreadcrumb } from './useBreadcrumb';

const MyComponent = () => {
const breadcrumbs = useBreadcrumb({
rootLabel: 'vRack services',
appName: 'vrack-services',
hideRootLabel: true|false
});
`,language:"javascript"})]})}function x(n={}){const{wrapper:r}={...o(),...n.components};return r?e.jsx(r,{...n,children:e.jsx(t,{...n})}):t(n)}export{x as default};
