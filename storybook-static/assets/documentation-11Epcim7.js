import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-DMscLk_r.js";import{M as c}from"./index-KONHwz82.js";import{S as r}from"./index-BFx4buwc.js";import"./index-Bnop-kX6.js";import"./iframe-D56x9By5.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";function i(s){const n={code:"code",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...l(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Manager React Components/Hooks/useUpdateServiceName"}),`
`,e.jsx(r,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"A React Query mutation hook that handles updating a service's display name."}),`
`,e.jsx(r,{label:"Api",level:2}),`
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
`,e.jsx(n.p,{children:"Update Service Name:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`PUT / services / { serviceId };
`})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Method: ",e.jsx(n.code,{children:"PUT"})]}),`
`,e.jsxs(n.li,{children:["Path Parameters:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"serviceId"}),": The ID of the service to update"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Request Body:",`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`{
  displayName: string;
}
`})}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(r,{label:"Parameters",level:2}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`type UseUpdateServiceDisplayNameParams = {
  /** Callback function called on successful update */
  onSuccess?: () => void;
  /** Callback function called when update fails */
  onError?: (result: ApiError) => void;
  /** Optional custom mutation key */
  mutationKey?: string[];
};
`})}),`
`,e.jsx(r,{label:"Returns",level:2}),`
`,e.jsx(n.p,{children:"Returns an object containing:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"updateDisplayName"}),": Function to trigger display name update"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"isLoading"}),": Loading state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"isError"}),": Error state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"error"}),": Error object if any"]}),`
`,e.jsx(n.li,{children:"Other mutation properties"}),`
`]}),`
`,e.jsx(r,{label:"Exemple",level:2}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { updateDisplayName, isLoading } = useUpdateServiceDisplayName({
  onSuccess: () => {
    // Handle successful update
  },
  onError: (error) => {
    // Handle error
  },
});

const handleUpdate = () => {
  updateDisplayName({
    resourceName: 'my-service',
    displayName: 'New Name',
  });
};
`})})]})}function v(s={}){const{wrapper:n}={...l(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(i,{...s})}):i(s)}export{v as default};
