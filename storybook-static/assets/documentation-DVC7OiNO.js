import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-CUIskjj6.js";import{M as l}from"./index-BRK_XPYQ.js";import{S as s}from"./index-D0iyo7GC.js";import"./index-Bnop-kX6.js";import"./iframe-Bmn67lXx.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-B5_veLQO.js";import"./index-2w0W-O47-BJ19ihbZ.js";function t(o){const n={code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...r(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Manager React Components/Hooks/useAllCountries"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"useAllCountries"})," hook is a data mapping utility designed to get a list of countries for all locations coming from the API v2 endpoint ",e.jsx(n.code,{children:"/location"}),"."]}),`
`,e.jsx(s,{label:"Api",level:2}),`
`,e.jsx(s,{label:"Parameters",level:3}),`
`,e.jsx(n.p,{children:"The hook does not take any parameter."}),`
`,e.jsx(s,{label:"Return Value",level:3}),`
`,e.jsxs(n.p,{children:["The hook returns a ",e.jsx(n.code,{children:"UseQueryResult"})," object with:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"data"}),": an array of ",e.jsx(n.code,{children:"Country"})," objects"]}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`type Country = {
  code: string;
  name: string;
};
`})}),`
`,e.jsx(s,{label:"Example Usage",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useAllCountries } from '@ovh-ux/manager-react-components';

function MyComponent() {
  const { data: allCountries } = useAllCountries();
}
`})}),`
`,e.jsx(s,{label:"Notes",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The hook uses React Query under the hood for efficient data caching and state management"}),`
`,e.jsxs(n.li,{children:["The hook use the same ",e.jsx(n.code,{children:"queryFn"})," and ",e.jsx(n.code,{children:"queryKey"})," as ",e.jsx(n.code,{children:"useAllLocationByType"}),", ",e.jsx(n.code,{children:"useCityByCode"})," and ",e.jsx(n.code,{children:"useLocationsByName"})," for efficiency"]}),`
`]})]})}function g(o={}){const{wrapper:n}={...r(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(t,{...o})}):t(o)}export{g as default};
