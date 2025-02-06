import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as a,b as n}from"./index-BQc_CwAG.js";import{useMDXComponents as s}from"./index-C-_6Vi3R.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./iframe-BL2J5MTA.js";import"../sb-preview/runtime.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";function r(i){const t=Object.assign({h1:"h1",h2:"h2",p:"p",code:"code",ul:"ul",li:"li",strong:"strong",hr:"hr",h3:"h3",h4:"h4",h5:"h5"},s(),i.components);return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Components/Datagrid Cursor/Documentation"}),`
`,e.jsx(t.h1,{id:"datagrid",children:"Datagrid"}),`
`,e.jsx(t.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.code,{children:"Datagrid"})," is table component used for displaying and interacting with data"]}),`
`,e.jsx(t.p,{children:"It supports advanced features like:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Sorting"}),": Enable column sorting with custom logic."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Infinite Scrolling"}),': Load additional data on demand with a "Load More" button.']}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Pagination"}),': Load additional data on demand with a "Load More" button.']}),`
`]}),`
`,e.jsx(t.h2,{id:"usage",children:"Usage"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Can be use with API V6 and API V2"}),`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"Pagination"})," mode is now deprecated"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"Cursor"})," navigation is recommended ",e.jsx("a",{target:"_blank",href:"https://apiv2.pages.ovhcloud.tools/deep-dive/seamless/pagination/",children:"link"})]}),`
`]}),`
`,e.jsx(t.hr,{}),`
`,e.jsxs(t.h3,{id:"tanstack-table-v8",children:["Tanstack Table ",e.jsx("a",{target:"_blank",href:"https://tanstack.com/table/latest/docs/introduction",children:"V8"})]}),`
`,e.jsx(t.p,{children:"The TanStack Table (formerly React Table) is a lightweight, powerful, and highly customizable library for building data grids and tables in React applications. It provides a modular architecture and advanced features to handle complex table requirements efficiently."}),`
`,e.jsx(t.p,{children:"Why Use TanStack Table?"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Flexibility"}),": Customize every aspect of the table, from rendering to state management."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Performance"}),": Lightweight and optimized for large datasets."]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Feature-Rich"}),": Sorting, filtering, pagination, and virtualization out of the box."]}),`
`]}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h4,{id:"filters",children:"Filters"}),`
`,e.jsx(t.h5,{id:"how-to-use-it",children:"How to use It"}),`
`,e.jsxs(t.p,{children:["1 - In your columns definition, fill ",e.jsx(t.code,{children:"type"})," or ",e.jsx(t.code,{children:"comparator"})," attributes"]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[`
`,e.jsxs(t.p,{children:[e.jsx(t.code,{children:"type"}),"comparator is a ",e.jsx(t.code,{children:"FilterTypeCategories"})]}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsxs(t.p,{children:[e.jsx(t.code,{children:"comparator"}),"is a ",e.jsx(t.code,{children:"string"})," of ",e.jsx(t.code,{children:"FilterCategories"}),", if you fill this attribute, it override the ",e.jsx(t.code,{children:"type"})," attributes"]}),`
`]}),`
`]}),`
`,e.jsx(n,{code:`
    export const colums = [
        {
            id: 'label',
            cell: (item: Item) => {
                return <DataGridTextCell>{item.label}</DataGridTextCell>;
            },
            label: 'Label',
            type: FilterTypeCategories.String
        },
        {
            id: 'price',
            cell: (item: Item) => {
                return <DataGridTextCell>{item.price} €</DataGridTextCell>;
            },
            label: 'Price',
            comparator: FilterCategories.String,
        },
    ];
    `,language:"javascript"}),`
`,e.jsxs(t.p,{children:["2 - In the datagrid component, pass ",e.jsx(t.code,{children:"filters"})," object"]}),`
`,e.jsx(n,{code:`
import { useResourcesV6, useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';

const { filters } = useResourcesIcebergV6({ ... });
const { filters } = useResourcesV6({ ... });

<Datagrid
    {...}
    filters={filters}
/>
    `,language:"javascript"}),`
`,e.jsx(t.p,{children:"If you are using a custom hook"}),`
`,e.jsx(n,{code:`
import { useColumnFilters } from '@ovh-ux/manager-react-components';

const { filters, addFilter, removeFilter } = useColumnFilters();

<Datagrid
    {...}
    filters={{filters: filters, add: addFilter, remove: removeFilter}}
/>
    `,language:"javascript"}),`
`,e.jsx(t.hr,{})]})}function f(i={}){const{wrapper:t}=Object.assign({},s(),i.components);return t?e.jsx(t,Object.assign({},i,{children:e.jsx(r,i)})):r(i)}export{f as default};
