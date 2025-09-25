import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-DMscLk_r.js";import{M as s}from"./index-KONHwz82.js";import{S as t}from"./index-BFx4buwc.js";import"./index-Bnop-kX6.js";import"./iframe-D56x9By5.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";function r(o){const n={code:"code",li:"li",p:"p",ul:"ul",...i(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Manager React Components/Hooks/useResourcesV6"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"A React Query hook that handles data retrieval, filtering, sorting and searching."}),`
`,e.jsx(t,{label:"Api",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"useResourcesV6"})," takes an object with the following definition as parameter:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"queryKey"})," (",e.jsx(n.code,{children:"string[]"}),", mandatory): The unique key identifying the query (used for caching purpose)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"queryFn"})," (",e.jsx(n.code,{children:"(route: string) => Promise<FetchResultV6<T>>"}),", optional): Define this function to override the query function used to retrieve the data. By default, ",e.jsx(n.code,{children:"V6"})," api is used."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"refetchInterval"})," (",e.jsx(n.code,{children:"(query: Query<FetchResultV6<T>>) => number | false"}),", optional): If you need polling, you can define this function. It takes the query and must return the interval in ms before the next query, or ",e.jsx(n.code,{children:"false"})," to stop polling."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"columns"})," (",e.jsx(n.code,{children:"DatagridColumn<T>[]"}),", mandatory): Columns used in the datagrid (used for searching, sorting and filtering)."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"defaultSorting"})," (",e.jsx(n.code,{children:"ColumnSort"}),", optional): By default, no sorting is done. The object take the name (",e.jsx(n.code,{children:"id"})," property) of the column and a ",e.jsx(n.code,{children:"desc"})," boolean property."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"route"})," (",e.jsx(n.code,{children:"string"}),", mandatory): The endpoint to get the data from."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"pageSize"})," (",e.jsx(n.code,{children:"number"}),", optional): The number of items to return per page (defaults to 10)."]}),`
`]})]})}function g(o={}){const{wrapper:n}={...i(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(r,{...o})}):r(o)}export{g as default};
