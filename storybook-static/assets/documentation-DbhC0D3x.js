import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-DdETsLzO.js";import{M as o,S as n}from"./index-BiZMyzLv.js";import"./index-Bnop-kX6.js";import"./iframe-Cw17PQb7.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function r(i){const t={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",hr:"hr",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/Components/Datagrid Cursor/Documentation"}),`
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
`,e.jsxs(t.p,{children:["1 - In your columns definition, fill ",e.jsx(t.code,{children:"type"})," and/or ",e.jsx(t.code,{children:"comparator"})," attributes"]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[`
`,e.jsxs(t.p,{children:[e.jsx(t.code,{children:"type"})," is a ",e.jsx(t.code,{children:"FilterTypeCategories"})," and will allow you to have enhanced filters (datepicker for date type, etc...)"]}),`
`]}),`
`,e.jsxs(t.li,{children:[`
`,e.jsxs(t.p,{children:[e.jsx(t.code,{children:"comparator"})," is a ",e.jsx(t.code,{children:"string"})," of ",e.jsx(t.code,{children:"FilterCategories"}),". Use this option to define the set of comparators that can be applied on the data. By default, Datagrid determines the set of comparators that can be applied depending on the ",e.jsx(t.code,{children:"type"})," field. ",e.jsx(t.strong,{children:"Only use this option if default comparators does not match your need."})]}),`
`]}),`
`]}),`
`,e.jsx(n,{code:`
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
        {
            id: 'creationDate',
            cell: (item: Item) => {
                return <DataGridTextCell>{useFormattedDate(item.creationDate)}</DataGridTextCell>;
            },
            label: 'Creation date',
            type: FilterTypeCategories.Date
            comparator: FilterCategories.Date,
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
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h3,{id:"filters-with-tags",children:"Filters with Tags"}),`
`,e.jsx(t.h4,{id:"how-to-use-it-1",children:"How to use It"}),`
`,e.jsxs(t.p,{children:["1 - In your columns definition, use ",e.jsx(t.code,{children:"type: Tags"})," attribute to use iam Tag filters for this column"]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"type"})," is a ",e.jsx(t.code,{children:"FilterTypeCategories"})]}),`
`]}),`
`,e.jsx(n,{code:`
    export const columns = [
        {
            id: 'tags',
            cell: (item: Item) => {
                return <DataGridTextCell>{JSON.stringify(item.iam?.tags)}</DataGridTextCell>;
            },
            label: 'Tags',
            type: FilterTypeCategories.Tags
        }
    ];
  `,language:"javascript"}),`
`,e.jsx(t.p,{children:"2 - Get only tags for corresponding resource"}),`
`,e.jsxs(t.p,{children:[`By default, the tag filter will fetch all the user existing tags but most of the time you would like to have only the tags for the resource displayed in the datagrid.
To be able to get only the tags associate to the resource, you can use `,e.jsx(t.code,{children:"resourceType"})," property on Datagrid definition."]}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"resourceType"})," can be found on APIv2 /iam/reference/resource/type."]}),`
`]}),`
`,e.jsx(n,{code:`
<Datagrid
    {...}
    resourceType="dedicatedServer"
/>
    `,language:"javascript"}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"Note:"})," Filters on Tags type of column is currently supported only on the primary resources."]}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h3,{id:"search",children:"Search"}),`
`,e.jsx(t.h4,{id:"how-to-use-it-2",children:"How to use It"}),`
`,e.jsxs(t.p,{children:["1 - In your columns definition, fill ",e.jsx(t.code,{children:"isSearchable"})," attribute, it will display the search input in datagrid topbar."]}),`
`,e.jsx(n,{code:`
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
`,e.jsx(n,{code:`
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
`,e.jsx(n,{code:`
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
`,e.jsx(n,{code:`
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
`,e.jsx(n,{code:`
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
`,e.jsx(n,{code:`
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
    `,language:"javascript"}),`
`,e.jsx(t.hr,{}),`
`,e.jsx(t.h3,{id:"row-selection",children:"Row selection"}),`
`,e.jsx(t.h4,{id:"how-to-use-it-3",children:"How to use It"}),`
`,e.jsxs(t.p,{children:["To activate default row selection, use ",e.jsx(t.code,{children:"rowSelection"})," attribute on the Datagrid definition."]}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-tsx",children:`const [rowSelection, setRowSelection] = useState({});

return
  <Datagrid
    ...
    rowSelection={{
      rowSelection,
      setRowSelection,
      onRowSelectionChange, // Optional
      enableRowSelection // optional
    }}
  />;
`})}),`
`,e.jsx(t.p,{children:"A new column is automatically displayed at the 1st place of the datagrid with checkboxes to select each row but also checkbox in the header to select / unselect all the rows."}),`
`,e.jsx(t.h4,{id:"disable-the-selection-for-some-of-the-rows",children:"Disable the selection for some of the rows"}),`
`,e.jsxs(t.p,{children:[e.jsx(t.code,{children:"enableRowsSelection"})," is a function that can be use inside ",e.jsx(t.code,{children:"rowSelection"}),` attribute to tell the Datagrid which row should be selectable or not.
The row is passed in the parameters of the function so it is easy to use on parent side.`]}),`
`,e.jsx(t.p,{children:"example:"}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-tsx",children:`const [rowSelection, setRowSelection] = useState({});

const isSelectable = (item: Item) => item.price > 10;

return
  <Datagrid
    ...
    rowSelection={{
      rowSelection,
      setRowSelection,
      enableRowSelection: ({ original: item }) => isSelectable(item)
    }}
  />;
`})}),`
`,e.jsx(t.p,{children:'In that case, only items with price > 10 would be selectable and others would have disabled checkbox. When using "select all" checkbox, only available checkboxes is selected.'}),`
`,e.jsx(t.h4,{id:"onrowselectionchange-callback",children:"onRowSelectionChange Callback"}),`
`,e.jsx(t.p,{children:"You can get the list of selectedRows using the onRowSelectionChange callback?"}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-tsx",children:`const [rowSelection, setRowSelection] = useState({});

const onRowSelectionChange = (selectedRows: Row<T>[]) => {
    // Compute anything with slected rows here
};

return
  <Datagrid
    ...
    rowSelection={{
      rowSelection,
      setRowSelection,
      onRowSelectionChange
    }}
  />;
`})}),`
`,e.jsx(t.h4,{id:"overwrite-the-rowid-for-better-row-selection",children:"Overwrite the rowId for better row selection"}),`
`,e.jsxs(t.p,{children:[`By default, the row id is the index of the item within the datagrid. To be able to better know which row has been selected,
you should always overwrite the row id with `,e.jsx(t.code,{children:"getRowId"})," attribute."]}),`
`,e.jsxs(t.p,{children:[e.jsx(t.code,{children:"getRowId"})," is a function that have row item passed as a parameter and should return the custom id as a string."]}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-tsx",children:`const getRowId = (item) => item.label;

return
  <Datagrid
    ...
    getRowId={getRowId}
  />;
`})}),`
`,e.jsx(t.p,{children:"when using this attribute, the selected rows will be defined by the custom id to be easier to work with."}),`
`,e.jsx(t.h4,{id:"select-all-behavior",children:"Select all behavior"}),`
`,e.jsx(t.p,{children:`Because most of the time, the pagination is made on api side, datagrid will only be able to select the items passed to it.
this means if the user select all and then load more, the newly displayed rows won't be selected.
To keep the consistency accros the manager, this behavior should be the same if the pagination is managed by the front.`}),`
`,e.jsx(t.h4,{id:"row-selection-and-datagrid-filter",children:"Row selection and datagrid filter"}),`
`,e.jsx(t.p,{children:"The defined behavior of row selection while filtering the item list is:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"If the selected row still appear on the list after filtering, it stay selected"}),`
`,e.jsx(t.li,{children:"If the selected row is hidden after filtering, it is removed from the selection"}),`
`,e.jsx(t.li,{children:"When cancelling the filter to show all the rows, the rows selected while filtered are still selected"}),`
`]})]})}function m(i={}){const{wrapper:t}={...s(),...i.components};return t?e.jsx(t,{...i,children:e.jsx(r,{...i})}):r(i)}export{m as default};
