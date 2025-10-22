import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-C2AXe9y-.js";import{M as c}from"./index-I5e0-Or7.js";import{S as s}from"./index-BeRy0IAz.js";import"./index-Bnop-kX6.js";import"./iframe-SQQI24zp.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-CfBVofaQ.js";function i(r){const n={code:"code",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...l(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Manager React Components/Hooks/useServiceDetails"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"A React Query hook that fetches service details for a given resource."}),`
`,e.jsx(s,{label:"Api",level:2}),`
`,e.jsx(n.p,{children:"The hook uses two API endpoints:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:"Get Service ID:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`GET /services?resourceName={resourceName}
`})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Method: ",e.jsx(n.code,{children:"GET"})]}),`
`,e.jsxs(n.li,{children:["Query Parameters:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"resourceName"}),": Filter on a specific service family"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Response: ",e.jsx(n.code,{children:"number[]"})," (array of service IDs)"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:"Get Service Details:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`GET / services / { serviceId };
`})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Method: ",e.jsx(n.code,{children:"GET"})]}),`
`,e.jsxs(n.li,{children:["Path Parameters:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"serviceId"}),": The ID of the service to fetch"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Response: ",e.jsx(n.code,{children:"ServiceDetails"})," object"]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(s,{label:"Parameters",level:2}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`type UseServiceDetailsParams = {
  /** Optional custom query key */
  queryKey?: string[];
  /** Resource name to fetch details for */
  resourceName: string;
};
`})}),`
`,e.jsx(s,{label:"Returns",level:2}),`
`,e.jsx(n.p,{children:"Returns a React Query result object containing:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"data"}),": The service details"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"isLoading"}),": Loading state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"isError"}),": Error state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"error"}),": Error object if any"]}),`
`,e.jsx(n.li,{children:"Other React Query result properties"}),`
`]}),`
`,e.jsx(s,{label:"Exemple",level:2}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { data, isLoading, isError } = useServiceDetails({
  resourceName: 'my-service',
});

if (isLoading) return <Loading />;
if (isError) return <Error />;

return <div>{data.displayName}</div>;
`})})]})}function v(r={}){const{wrapper:n}={...l(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(i,{...r})}):i(r)}export{v as default};
