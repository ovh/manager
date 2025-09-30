import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-DdETsLzO.js";import{M as c}from"./index-BiZMyzLv.js";import{S as s}from"./index-DBID-FYl.js";import"./index-Bnop-kX6.js";import"./iframe-Cw17PQb7.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";function i(r){const n={code:"code",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...l(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Manager React Components/Hooks/useDeleteService"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"A React Query mutation hook that handles service deletion."}),`
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
`,e.jsx(n.p,{children:"Terminate Service:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`POST / services / { serviceId } / terminate;
`})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Method: ",e.jsx(n.code,{children:"POST"})]}),`
`,e.jsxs(n.li,{children:["Path Parameters:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"serviceId"}),": The ID of the service to terminate"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Response: ",e.jsx(n.code,{children:"{ message: string }"})]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(s,{label:"Parameters",level:2}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`type UseDeleteServiceParams = {
  /** Callback function called on successful deletion */
  onSuccess?: () => void;
  /** Callback function called when deletion fails */
  onError?: (result: ApiError) => void;
  /** Optional custom mutation key */
  mutationKey?: string[];
};
`})}),`
`,e.jsx(s,{label:"Returns",level:2}),`
`,e.jsx(n.p,{children:"Returns an object containing:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"terminateService"}),": Function to trigger service deletion"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"isLoading"}),": Loading state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"isError"}),": Error state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"error"}),": Error object if any"]}),`
`,e.jsx(n.li,{children:"Other mutation properties"}),`
`]}),`
`,e.jsx(s,{label:"Exemple",level:2}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { terminateService, isLoading } = useDeleteService({
  onSuccess: () => {
    // Handle successful deletion
  },
  onError: (error) => {
    // Handle error
  },
});

const handleDelete = () => {
  terminateService({ resourceName: 'my-service' });
};
`})})]})}function g(r={}){const{wrapper:n}={...l(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(i,{...r})}):i(r)}export{g as default};
