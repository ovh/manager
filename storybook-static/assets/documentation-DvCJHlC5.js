import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-CdjcsXAS.js";import{M as c}from"./index-znkjjTxY.js";import{S as s}from"./index-b8hj9e6-.js";import"./index-Bnop-kX6.js";import"./iframe-CHNKH7Wl.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-PzEU9Mdi.js";import"./index-oX_7i0mk.js";function i(n){const r={code:"code",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...l(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Manager React Components/Hooks/useServiceDetails"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(r.p,{children:"A React Query hook that fetches service details for a given resource."}),`
`,e.jsx(s,{label:"Api",level:2}),`
`,e.jsx(r.p,{children:"The hook uses two API endpoints:"}),`
`,e.jsxs(r.ol,{children:[`
`,e.jsxs(r.li,{children:[`
`,e.jsx(r.p,{children:"Get Service ID:"}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-typescript",children:`GET /services?resourceName={resourceName}
`})}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:["Method: ",e.jsx(r.code,{children:"GET"})]}),`
`,e.jsxs(r.li,{children:["Query Parameters:",`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"resourceName"}),": Filter on a specific service family"]}),`
`]}),`
`]}),`
`,e.jsxs(r.li,{children:["Response: ",e.jsx(r.code,{children:"number[]"})," (array of service IDs)"]}),`
`]}),`
`]}),`
`,e.jsxs(r.li,{children:[`
`,e.jsx(r.p,{children:"Get Service Details:"}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-typescript",children:`GET / services / { serviceId };
`})}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:["Method: ",e.jsx(r.code,{children:"GET"})]}),`
`,e.jsxs(r.li,{children:["Path Parameters:",`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"serviceId"}),": The ID of the service to fetch"]}),`
`]}),`
`]}),`
`,e.jsxs(r.li,{children:["Response: ",e.jsx(r.code,{children:"ServiceDetails"})," object"]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(s,{label:"Parameters",level:2}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-typescript",children:`type UseServiceDetailsParams = {
  /** Optional custom query key */
  queryKey?: string[];
  /** Resource name to fetch details for */
  resourceName: string;
};
`})}),`
`,e.jsx(s,{label:"Returns",level:2}),`
`,e.jsx(r.p,{children:"Returns a React Query result object containing:"}),`
`,e.jsxs(r.ul,{children:[`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"data"}),": The service details"]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"isLoading"}),": Loading state"]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"isError"}),": Error state"]}),`
`,e.jsxs(r.li,{children:[e.jsx(r.code,{children:"error"}),": Error object if any"]}),`
`,e.jsx(r.li,{children:"Other React Query result properties"}),`
`]}),`
`,e.jsx(s,{label:"Exemple",level:2}),`
`,e.jsx(r.pre,{children:e.jsx(r.code,{className:"language-tsx",children:`const { data, isLoading, isError } = useServiceDetails({
  resourceName: 'my-service',
});

if (isLoading) return <Loading />;
if (isError) return <Error />;

return <div>{data.displayName}</div>;
`})})]})}function g(n={}){const{wrapper:r}={...l(),...n.components};return r?e.jsx(r,{...n,children:e.jsx(i,{...n})}):i(n)}export{g as default};
