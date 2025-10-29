import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-C_TmCcSR.js";import{b as l,S as a,c as i,d as r}from"./index-CphCMeQQ.js";import{M as c,C as d}from"./index-CRX28agf.js";import u,{Default as m}from"./datagrid.stories-D4ThA_E8.js";import{e as h}from"./external-links-D1KKeGes.js";import"./index-Bnop-kX6.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react94-Bxf0SjVg.js";import"./iframe-CUYazWvm.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./Button-BC-ipw2F-4e7GV2_-.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./ods-react65-wKxTpDjY.js";import"./FormFieldLabel-DerGjSSG-BDyW1aTt.js";import"./Text-CcNd6qQr-FOgQIkhx.js";import"./ods-react61-4lD3hp9p.js";import"./Input-DcqcPYne-BLK_63J0.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./lib-CWaID5dp-BJDNWG0v.js";import"./index-C2BvAoka.js";import"./index-ChJ3dufK.js";function s(t){const n={a:"a",code:"code",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...o(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Manager UI Kit/Components/Datagrid New/Documentation"}),`
`,e.jsx(l,{of:u}),`
`,e.jsx(d,{layout:"centered",of:m,sourceState:"none"}),`
`,e.jsx(a,{label:"Overview",level:2}),`
`,e.jsx(i,{name:"Datagrid",relatedComponents:[{name:"Table",href:h.ods.table}],children:e.jsx(n.p,{children:"The Datagrid component is a powerful data table built on top of TanStack Table, providing advanced features for displaying and interacting with tabular data. It supports sorting, filtering, pagination, and customizable column definitions."})}),`
`,e.jsx(a,{label:"Features",level:3}),`
`,e.jsx(r,{data:{columns:["feature","description","status"],rows:[{feature:"Column Sorting",description:"Client-side and server-side sorting with TanStack Table integration",status:"✅"},{feature:"Manual Sorting",description:"Server-side sorting control with manualSorting prop",status:"✅"},{feature:"Custom Columns",description:"Flexible column definitions with custom cell renderers",status:"✅"},{feature:"Pagination",description:"Progressive data loading with Load more and Load all actions",status:"✅"},{feature:"Search",description:"Global search input to filter rows across searchable columns",status:"✅"},{feature:"Filters",description:"Column-level filters with comparators, options and removable chips",status:"✅"},{feature:"Columns visiblity",description:"Toggle column visibility via a columns picker with Select all",status:"✅"},{feature:"Row selection",description:"Single or multi-row selection with a header master checkbox",status:"✅"},{feature:"Column Expandable",description:"Expandable rows to display hierarchical or nested data",status:"✅"},{feature:"Subcomponent",description:"Custom sub-rows to render additional content below a row",status:"✅"}]}}),`
`,e.jsx(a,{label:"Virtualization",level:3}),`
`,e.jsxs(n.p,{children:["The Datagrid uses row virtualization (TanStack Virtual) to render only the visible rows, ensuring smooth scrolling and performance with large datasets. The container height is auto-calculated, and you can override it with the ",e.jsx(n.code,{children:"containerHeight"})," prop if needed."]}),`
`,e.jsx(a,{label:"Sorting Configuration",level:3}),`
`,e.jsx(n.p,{children:"The Datagrid supports two sorting modes:"}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Client-side Sorting (Default)"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
  sorting={sorting}
  onSortChange={setSorting}
  manualSorting={false} // Default
/>
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Server-side Sorting (Manual)"})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
  sorting={sorting}
  onSortChange={setSorting}
  manualSorting={true} // Server handles sorting
/>
`})}),`
`,e.jsx(a,{label:"Footer Actions",level:3}),`
`,e.jsx(n.p,{children:"The Datagrid includes built-in pagination controls in the footer for progressive data loading."}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Load More Button"}),`
Incrementally loads additional data when clicked.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
  hasNextPage={true}
  onFetchNextPage={() => {
    // Fetch next page of data
  }}
/>
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Load All Button"}),`
Loads all remaining data at once.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
  hasNextPage={true}
  onFetchAllPages={() => {
    // Fetch all remaining data
  }}
/>
`})}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Loading State"}),`
Both buttons can show loading indicators when data is being fetched.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
  hasNextPage={true}
  onFetchNextPage={handleFetchNext}
  onFetchAllPages={handleFetchAll}
  isLoading={true} // Shows loading state
/>
`})}),`
`,e.jsx(a,{label:"Custom Columns",level:3}),`
`,e.jsx(n.p,{children:"Define columns with custom cell renderers."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    cell: ({ getValue }) => <strong>{getValue<string>()}</strong>,
  },
  {
    id: 'age',
    header: 'Age',
    accessorKey: 'age',
  },
];

<Datagrid columns={columns} data={data} />
`})}),`
`,e.jsx(a,{label:"Search",level:3}),`
`,e.jsx(n.p,{children:"Enable a global search input."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const [searchInput, setSearchInput] = useState('');

<Datagrid
  columns={columns}
  data={data}
  enableSearch
  search={{
    searchInput,
    setSearchInput,
    onSearch: (value) => {
      // Trigger server or client-side search
      console.log('search', value);
    },
    placeholder: 'Search...',
  }}
  enableSearch={true}
/>;
`})}),`
`,e.jsx(a,{label:"Filters",level:3}),`
`,e.jsx(n.p,{children:"Add column-level filters with a filter popover and removable chips."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const [filters, setFilters] = useState([]);

<Datagrid
  columns={columns}
  data={data}
  enableFilter
  filters={{
    filters,
    add: (f) => setFilters((prev) => [...prev, f]),
    remove: (f) => setFilters((prev) => prev.filter((x) => x.key !== f.key)),
  }}
  resourceType="example"
  enableSorting={true}
/>;
`})}),`
`,e.jsx(a,{label:"Columns visibility",level:3}),`
`,e.jsx(n.p,{children:"Toggle columns on and off via the visibility menu."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const [columnVisibility, setColumnVisibility] = useState({});

const columns = [
  { id: 'name', header: 'Name', accessorKey: 'name', enableHiding: true },
  { id: 'age', header: 'Age', accessorKey: 'age', enableHiding: true },
];

<Datagrid
  columns={columns}
  data={data}
  enableColumnvisibility
  columnVisibility={columnVisibility}
  setColumnVisibility={setColumnVisibility}
  enableColumnvisibility={true}
/>;
`})}),`
`,e.jsx(a,{label:"Row selection",level:3}),`
`,e.jsx(n.p,{children:"Allow selecting one or multiple rows."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const [rowSelection, setRowSelection] = useState({});

<Datagrid
  columns={columns}
  data={data}
  rowSelection={{
    rowSelection,
    setRowSelection,
    onRowSelectionChange: (rows) => console.log('selected rows', rows),
    // Optionally restrict selection
    // enableRowSelection: (row) => row.original.locked !== true,
  }}
/>;
`})}),`
`,e.jsx(a,{label:"Expandable rows",level:3}),`
`,e.jsxs(n.p,{children:["Display hierarchical data with expandable rows, use ",e.jsx(n.code,{children:"subRow"})," in your data items."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const items = [
  {
    id: '1,
    person: 'John Doe',
    subRows: [
      {
        id: '99,
        person: 'Joahn Cruyff',
      },
      {
        id: '100,
        person: 'Michel Platini',
      },
      {
        id: '101',
        person: 'Lionel Messi',
      }
    ]
  }
];
const [expanded, setExpanded] = useState<ExpandedState>({});

<Datagrid<Item>
  columns={columns}
  data={items}
  expandable={{
    expanded,
    setExpanded,
    enableExpanded
  }}
/>;
`})}),`
`,e.jsx(a,{label:"Subcomponent",level:3}),`
`,e.jsx(n.p,{children:"Render a custom sub-row below a row."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
  renderSubComponent={(row) => (
    <div>Details for {row.original.name}</div>
  )}
  subComponentHeight={80}
/>;
`})}),`
`,e.jsx(a,{label:"External Resources",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"TanStack Table"}),": ",e.jsx(n.a,{href:"https://tanstack.com/table/latest",rel:"nofollow",children:"Official Documentation"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ODS Table Component"}),": ",e.jsx(n.a,{href:"%7BDatagrid.ods.table%7D",children:"Design System Table"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React Table Examples"}),": ",e.jsx(n.a,{href:"https://github.com/TanStack/table/tree/main/examples/react/sorting",rel:"nofollow",children:"GitHub Examples"})]}),`
`]})]})}function z(t={}){const{wrapper:n}={...o(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{z as default};
