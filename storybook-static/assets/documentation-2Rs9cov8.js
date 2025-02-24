import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as a,b as r}from"./index-BBJphcUm.js";import{useMDXComponents as s}from"./index-C-_6Vi3R.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./iframe-7YQcTsof.js";import"../sb-preview/runtime.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";function i(t){const n=Object.assign({h1:"h1",h2:"h2",p:"p",code:"code",ul:"ul",li:"li",strong:"strong",hr:"hr",h3:"h3",h4:"h4",em:"em"},s(),t.components);return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Components/Datagrid Cursor/Documentation"}),`
`,e.jsx(n.h1,{id:"datagrid",children:"Datagrid"}),`
`,e.jsx(n.h2,{id:"overview",children:"Overview"}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"Datagrid"})," is table component used for displaying and interacting with data"]}),`
`,e.jsx(n.p,{children:"It supports advanced features like:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Sorting"}),": Enable column sorting with custom logic."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Infinite Scrolling"}),': Load additional data on demand with a "Load More" button.']}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Pagination"}),': Load additional data on demand with a "Load More" button.']}),`
`]}),`
`,e.jsx(n.h2,{id:"usage",children:"Usage"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Can be use with API V6 and API V2"}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Pagination"})," mode is now deprecated"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Cursor"})," navigation is recommended ",e.jsx("a",{target:"_blank",href:"https://apiv2.pages.ovhcloud.tools/deep-dive/seamless/pagination/",children:"link"})]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsxs(n.h3,{id:"tanstack-table-v8",children:["Tanstack Table ",e.jsx("a",{target:"_blank",href:"https://tanstack.com/table/latest/docs/introduction",children:"V8"})]}),`
`,e.jsx(n.p,{children:"The TanStack Table (formerly React Table) is a lightweight, powerful, and highly customizable library for building data grids and tables in React applications. It provides a modular architecture and advanced features to handle complex table requirements efficiently."}),`
`,e.jsx(n.p,{children:"Why Use TanStack Table?"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Flexibility"}),": Customize every aspect of the table, from rendering to state management."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Performance"}),": Lightweight and optimized for large datasets."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Feature-Rich"}),": Sorting, filtering, pagination, and virtualization out of the box."]}),`
`]}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"filters",children:"Filters"}),`
`,e.jsx(n.h4,{id:"how-to-use-it",children:"How to use It"}),`
`,e.jsxs(n.p,{children:["1 - In your columns definition, fill ",e.jsx(n.code,{children:"type"})," or ",e.jsx(n.code,{children:"comparator"})," attributes"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"type"}),"comparator is a ",e.jsx(n.code,{children:"FilterTypeCategories"})]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"comparator"}),"is a ",e.jsx(n.code,{children:"string"})," of ",e.jsx(n.code,{children:"FilterCategories"}),", if you fill this attribute, it override the ",e.jsx(n.code,{children:"type"})," attributes"]}),`
`]}),`
`]}),`
`,e.jsx(r,{code:`
    export const columns = [
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
`,e.jsxs(n.p,{children:["2 - In the datagrid component, pass ",e.jsx(n.code,{children:"filters"})," object"]}),`
`,e.jsx(r,{code:`
import { useResourcesV6, useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';

const { filters } = useResourcesIcebergV6({ ... });
const { filters } = useResourcesV6({ ... });

<Datagrid
    {...}
    filters={filters}
/>
    `,language:"javascript"}),`
`,e.jsx(n.p,{children:"If you are using a custom hook"}),`
`,e.jsx(r,{code:`
import { useColumnFilters } from '@ovh-ux/manager-react-components';

const { filters, addFilter, removeFilter } = useColumnFilters();

<Datagrid
    {...}
    filters={{filters: filters, add: addFilter, remove: removeFilter}}
/>
    `,language:"javascript"}),`
`,e.jsx(n.hr,{}),`
`,e.jsx(n.h3,{id:"search",children:"Search"}),`
`,e.jsx(n.h4,{id:"how-to-use-it-1",children:"How to use It"}),`
`,e.jsxs(n.p,{children:["1 - In your columns definition, fill ",e.jsx(n.code,{children:"isSearchable"})," attribute, it will display the search input in datagrid topbar."]}),`
`,e.jsx(r,{code:`
    export const columns = [
        {
            id: 'label',
            cell: (item: Item) => {
                return <DataGridTextCell>{item.label}</DataGridTextCell>;
            },
            label: 'Label',
            isFilterable: true,
            isSearchable: true,
        }
    ];
    `,language:"javascript"}),`
`,e.jsxs(n.p,{children:["2 - Pass ",e.jsx(n.code,{children:"search"})," object to Datagrid component"]}),`
`,e.jsx(r,{code:`
<Datagrid
    {...}
    search={search}
/>`,language:"javascript"}),`
`,e.jsxs(n.p,{children:["What contains ",e.jsx(n.code,{children:"search"})," object :"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"searchInput"}),": react state, can be string | number | null"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"setSearchInput"}),": setter of search input state"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"onSearch"}),": handler when user click on the button search."]}),`
`]}),`
`,e.jsx(n.h4,{id:"search-with-useresourcesicebergv6",children:"Search with useResourcesIcebergV6"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:e.jsxs(n.em,{children:["note : apiv6 only support operator ",e.jsx(n.code,{children:"&"}),", we can't combine multiple search"]})})}),`
`,e.jsxs(n.p,{children:["1 - Fill ",e.jsx(n.code,{children:"columns"})," attribute with your columns definition"]}),`
`,e.jsx(r,{code:`
import {
  useResourcesIcebergV6,
} from '@ovh-ux/manager-react-components';
  const {
    {...}
    search, // it return search object
  } = useResourcesIcebergV6({
    {...}
    columns, // you have to pass the columns definition now
  });
    `,language:"javascript"}),`
`,e.jsxs(n.p,{children:["2 - The",e.jsx(n.code,{children:"search"})," object returned by the ",e.jsx(n.code,{children:"useResourcesIcebergV6"})," hook must be passed to your ",e.jsx(n.code,{children:"Datagrid"}),"'s props"]}),`
`,e.jsx(r,{code:`
<Datagrid
    {...}
    filters={filters}
    search={search}
    isLoading={isLoading}
/>
    `,language:"javascript"})]})}function b(t={}){const{wrapper:n}=Object.assign({},s(),t.components);return n?e.jsx(n,Object.assign({},t,{children:e.jsx(i,t)})):i(t)}export{b as default};
