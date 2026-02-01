import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-CWIOTABv.js";import{M as r}from"./index-CExQY-2-.js";import{S as t}from"./index-DcLqt6dN.js";import"./index-Bnop-kX6.js";import"./iframe-B25DnDzc.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-B5_veLQO.js";import"./index-2w0W-O47-BJ19ihbZ.js";function i(o){const n={code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...s(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Manager React Components/Hooks/useCityByCode"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"useCityByCode"})," hook is a data filtering utility designed to get a city name for locations coming from the API v2 endpoint ",e.jsx(n.code,{children:"/location"})," with a matching code."]}),`
`,e.jsx(t,{label:"Api",level:2}),`
`,e.jsx(t,{label:"Parameters",level:3}),`
`,e.jsxs(n.p,{children:["The hook accept a single ",e.jsx(n.code,{children:"string"})," parameter representing the code of the searched city"]}),`
`,e.jsx(t,{label:"Return Value",level:3}),`
`,e.jsxs(n.p,{children:["The hook returns a ",e.jsx(n.code,{children:"UseQueryResult"})," object with:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"data"}),": a ",e.jsx(n.code,{children:"string"})," representing the name of the city matching the code given in parameter"]}),`
`]}),`
`,e.jsx(t,{label:"Example Usage",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useCityByCode } from '@ovh-ux/manager-react-components';

function MyComponent() {
  const { data: cityName } = useCityByCode('mycityCode');
}
`})}),`
`,e.jsx(t,{label:"Notes",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The hook uses React Query under the hood for efficient data caching and state management"}),`
`,e.jsxs(n.li,{children:["The hook use the same ",e.jsx(n.code,{children:"queryFn"})," and ",e.jsx(n.code,{children:"queryKey"})," as ",e.jsx(n.code,{children:"useAllCountries"}),", ",e.jsx(n.code,{children:"useAllLocationsByType"})," and ",e.jsx(n.code,{children:"useLocationByName"})," for efficiency"]}),`
`]})]})}function f(o={}){const{wrapper:n}={...s(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(i,{...o})}):i(o)}export{f as default};
