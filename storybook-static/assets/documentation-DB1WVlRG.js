import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as a,b as r}from"./index-BS4z4P-7.js";import{useMDXComponents as n}from"./index-C-_6Vi3R.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./iframe-BfzHV1O9.js";import"../sb-preview/runtime.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";function s(i){const t=Object.assign({h1:"h1",h2:"h2",p:"p",code:"code",ul:"ul",li:"li",strong:"strong",hr:"hr",h3:"h3",h4:"h4",em:"em"},n(),i.components);return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Components/Datagrid Cursor/Documentation"}),`
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
`,e.jsx(t.h3,{id:"filters",children:"Filters"}),`
`,e.jsx(t.h4,{id:"how-to-use-it",children:"How to use It"}),`
`,e.jsxs(t.p,{children:["1 - In your columns definition, fill ",e.jsx(t.code,{children:"type"})," or ",e.jsx(t.code,{children:"comparator"})," attributes"]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[`
`,e.jsxs(t.p,{children:[e.jsx(t.code,{children:"type"}),"comparator is a ",e.jsx(t.code,{children:"FilterTypeCategories"})]}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsxs(t.p,{children:[e.jsx(t.code,{children:"comparator"}),"is a ",e.jsx(t.code,{children:"string"})," of ",e.jsx(t.code,{children:"FilterCategories"}),", if you fill this attribute, it override the ",e.jsx(t.code,{children:"type"})," attributes"]}),`
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
`,e.jsxs(t.p,{children:["2 - In the datagrid component, pass ",e.jsx(t.code,{children:"filters"})," object"]}),`
`,e.jsx(r,{code:`
import { useResourcesV6, useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';

const { filters } = useResourcesIcebergV6({ ... });
const { filters } = useResourcesV6({ ... });

<Datagrid
    {...}
    filters={filters}
/>
    `,language:"javascript"}),`
`,e.jsx(t.p,{children:"If you are using a custom hook"}),`
`,e.jsx(r,{code:`
import { useColumnFilters } from '@ovh-ux/manager-react-components';

const { filters, addFilter, removeFilter } = useColumnFilters();

<Datagrid
    {...}
    filters={{filters: filters, add: addFilter, remove: removeFilter}}
/>
    `,language:"javascript"}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h3,{id:"search",children:"Search"}),`
`,e.jsx(t.h4,{id:"how-to-use-it-1",children:"How to use It"}),`
`,e.jsxs(t.p,{children:["1 - In your columns definition, fill ",e.jsx(t.code,{children:"isSearchable"})," attribute, it will display the search input in datagrid topbar."]}),`
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
`,e.jsxs(t.p,{children:["2 - Pass ",e.jsx(t.code,{children:"search"})," object to Datagrid component"]}),`
`,e.jsx(r,{code:`
<Datagrid
    {...}
    search={search}
/>`,language:"javascript"}),`
`,e.jsxs(t.p,{children:["What contains ",e.jsx(t.code,{children:"search"})," object :"]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"searchInput"}),": react state, can be string | number | null"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"setSearchInput"}),": setter of search input state"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"onSearch"}),": handler when user click on the button search."]}),`
`]}),`
`,e.jsx(t.h4,{id:"with-useresourcesicebergv6-hook",children:"With useResourcesIcebergV6 hook"}),`
`,e.jsx(t.p,{children:e.jsx(t.strong,{children:e.jsxs(t.em,{children:["note : apiv6 only support operator ",e.jsx(t.code,{children:"&"}),", we can't combine multiple search"]})})}),`
`,e.jsxs(t.p,{children:["1 - Fill ",e.jsx(t.code,{children:"columns"})," attribute with your columns definition. The",e.jsx(t.code,{children:"search"})," object returned by the ",e.jsx(t.code,{children:"useResourcesIcebergV6"})," hook must be passed to your ",e.jsx(t.code,{children:"Datagrid"}),"'s props"]}),`
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

<Datagrid
    {...}
    filters={filters}
    search={search} // pass the params search here
    isLoading={isLoading}
/>
    `,language:"javascript"}),`
`,e.jsx(t.p,{children:"Exemple of column definition"}),`
`,e.jsx(r,{code:`
    const columns = [
        {
            id: 'label',
            cell: (item: Item) => {
                return <DataGridTextCell>{item.label}</DataGridTextCell>;
            },
            label: 'Label',
            isFilterable: true,
            isSearchable: true,
            comparator: FilterCategories.String,
        },
        {
            id: 'ip',
            cell: (item: Item) => {
                return <DataGridTextCell>{item.ip}</DataGridTextCell>;
            },
            label: 'ip',
            isFilterable: true,
            isSearchable: false, // only one column can be searchable
            comparator: FilterCategories.String,
        }
    ];
    `,language:"javascript"}),`
`,e.jsx(t.h4,{id:"with-useresourcesv6-hook",children:"With useResourcesV6 hook"}),`
`,e.jsx(t.p,{children:e.jsx(t.strong,{children:e.jsx(t.em,{children:"note : You can apply search in multiples columns and type attribute is mandatory in your column definition"})})}),`
`,e.jsxs(t.p,{children:["Fill ",e.jsx(t.code,{children:"columns"})," attribute with your columns definition. The",e.jsx(t.code,{children:"search"})," object returned by the ",e.jsx(t.code,{children:"useResourcesV6"})," hook must be passed to your ",e.jsx(t.code,{children:"Datagrid"}),"'s props"]}),`
`,e.jsx(r,{code:`
import {
  useResourcesV6,
} from '@ovh-ux/manager-react-components';
  const {
    {...}
    search, // it return search object
  } = useResourcesV6({
    {...}
    columns, // you have to pass the columns definition now
  });
]

<Datagrid
    {...}
    filters={filters}
    search={search} // pass the params search here
    isLoading={isLoading}
/>
`,language:"javascript"}),`
`,e.jsx(t.p,{children:"Exemple of column definition"}),`
`,e.jsx(r,{code:`
    const columns = [
        {
            id: 'label',
            cell: (item: Item) => {
                return <DataGridTextCell>{item.label}</DataGridTextCell>;
            },
            label: 'Label',
            isFilterable: true,
            isSearchable: true, // you can define multiple searchable column
            comparator: FilterCategories.String,
            type: FilterTypeCategories.String // type attribute is mandatory
        },
        {
            id: 'ip',
            cell: (item: Item) => {
                return <DataGridTextCell>{item.ip}</DataGridTextCell>;
            },
            label: 'ip',
            isFilterable: true,
            isSearchable: true, // you can define multiple searchable column
            comparator: FilterCategories.String,
            type: FilterTypeCategories.String // type attribute is mandatory
        }
    ];
    `,language:"javascript"})]})}function b(i={}){const{wrapper:t}=Object.assign({},n(),i.components);return t?e.jsx(t,Object.assign({},i,{children:e.jsx(s,i)})):s(i)}export{b as default};
