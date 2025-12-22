import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-DqKhBd7Q.js";import{b as s,S as t,c as r,d as l}from"./index-XMn4HDGw.js";import{M as c,C as d}from"./index-B5Jzr0Xc.js";import m,{Default as u}from"./datagrid.stories-Dd8a2xiv.js";import{e as p}from"./external-links-D-zcWSEn.js";import"./index-Bnop-kX6.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react94-Bxf0SjVg.js";import"./iframe-CveYUpa2.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./lib-BnpaaP8W-DiimR21H.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";import"./index-DZGBJQ4L.js";function o(a){const n={a:"a",code:"code",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Manager UI Kit/Components/Datagrid/Documentation"}),`
`,e.jsx(s,{of:m}),`
`,e.jsx(d,{layout:"centered",of:u,sourceState:"none"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsx(r,{name:"Datagrid",relatedComponents:[{name:"Table",href:p.ods.table}],children:e.jsx(n.p,{children:"The Datagrid component is a powerful data table built on top of TanStack Table, providing advanced features for displaying and interacting with tabular data. It supports sorting, filtering, pagination, and customizable column definitions."})}),`
`,e.jsx(t,{label:"Features",level:3}),`
`,e.jsx(l,{data:{columns:["feature","description","status"],rows:[{feature:"Column Sorting",description:"Client-side and server-side sorting with TanStack Table integration",status:"✅"},{feature:"Manual Sorting",description:"Server-side sorting control with manualSorting prop",status:"✅"},{feature:"Custom Columns",description:"Flexible column definitions with custom cell renderers",status:"✅"},{feature:"Pagination",description:"Progressive data loading with Load more and Load all actions",status:"✅"},{feature:"Search",description:"Global search input to filter rows across searchable columns",status:"✅"},{feature:"Filters",description:"Column-level filters with comparators, options and removable chips",status:"✅"},{feature:"Columns visiblity",description:"Toggle column visibility via a columns picker with Select all",status:"✅"},{feature:"Row selection",description:"Single or multi-row selection with a header master checkbox",status:"✅"},{feature:"Column Expandable",description:"Expandable rows to display hierarchical or nested data",status:"✅"},{feature:"Subcomponent",description:"Custom sub-rows to render additional content below a row",status:"✅"}]}}),`
`,e.jsx(t,{label:"Virtualization",level:3}),`
`,e.jsxs(n.p,{children:["The Datagrid uses row virtualization (TanStack Virtual) to render only the visible rows, ensuring smooth scrolling and performance with large datasets. The container height is auto-calculated, and you can override it with the ",e.jsx(n.code,{children:"containerHeight"})," prop if needed."]}),`
`,e.jsx(t,{label:"Sorting Configuration",level:3}),`
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
`,e.jsx(t,{label:"Footer Actions",level:3}),`
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
`,e.jsx(t,{label:"Custom Columns",level:3}),`
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
`,e.jsx(t,{label:"Search",level:3}),`
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
`,e.jsx(t,{label:"Filters",level:3}),`
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
`,e.jsx(t,{label:"Columns visibility",level:3}),`
`,e.jsx(n.p,{children:"Toggle columns on and off via the visibility menu."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { VisibilityState } from '@tanstack/react-table';
const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

const columns = [
  { id: 'name', header: 'Name', accessorKey: 'name', enableHiding: true },
  { id: 'age', header: 'Age', accessorKey: 'age', enableHiding: true },
];

<Datagrid
  columns={columns}
  data={data}
  columnVisibility={
    columnVisibility,
    setColumnVisibility,
  }
/>;
`})}),`
`,e.jsx(t,{label:"Row selection",level:3}),`
`,e.jsx(n.p,{children:"Allow selecting one or multiple rows."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { RowSelectionState } from '@tanstack/react-table';
const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

<Datagrid
  columns={columns}
  data={data}
  rowSelection={{
    rowSelection,
    setRowSelection,
  }}
/>;
`})}),`
`,e.jsx(t,{label:"Expandable rows",level:3}),`
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
`,e.jsx(t,{label:"Subcomponent",level:3}),`
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
`,e.jsx(t,{label:"External Resources",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"TanStack Table"}),": ",e.jsx(n.a,{href:"https://tanstack.com/table/latest",rel:"nofollow",children:"Official Documentation"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ODS Table Component"}),": ",e.jsx(n.a,{href:"%7BDatagrid.ods.table%7D",children:"Design System Table"})]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"React Table Examples"}),": ",e.jsx(n.a,{href:"https://github.com/TanStack/table/tree/main/examples/react/sorting",rel:"nofollow",children:"GitHub Examples"})]}),`
`]})]})}function fe(a={}){const{wrapper:n}={...i(),...a.components};return n?e.jsx(n,{...a,children:e.jsx(o,{...a})}):o(a)}export{fe as default};
