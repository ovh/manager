import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-JTD1cOSY.js";import{b as r,S as a,c as o,d as i}from"./index-jLuFHCq3.js";import{M as c,C as d}from"./index-BOVma5jo.js";import u,{Default as m}from"./datagrid.stories-B9AhBfWu.js";import{e as h}from"./external-links-D-zcWSEn.js";import"./index-Bnop-kX6.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./iframe-COCNz2cq.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./lib-7WI39Bnb-B8YmdMzd.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./Divider-wQyo85oE-5vlIiwia.js";import"./index-DZGBJQ4L.js";function s(t){const n={a:"a",code:"code",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...l(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Manager UI Kit/Components/Datagrid/Documentation"}),`
`,e.jsx(r,{of:u}),`
`,e.jsx(d,{layout:"centered",of:m,sourceState:"none"}),`
`,e.jsx(a,{label:"Overview",level:2}),`
`,e.jsx(o,{name:"Datagrid",relatedComponents:[{name:"Table",href:h.ods.table}],children:e.jsx(n.p,{children:"The Datagrid component is a powerful data table built on top of TanStack Table, providing advanced features for displaying and interacting with tabular data. It supports sorting, filtering, pagination, and customizable column definitions."})}),`
`,e.jsx(a,{label:"Features",level:3}),`
`,e.jsx(i,{data:{columns:["feature","description","status"],rows:[{feature:"Column Sorting",description:"Client-side and server-side sorting with TanStack Table integration",status:"✅"},{feature:"Manual Sorting",description:"Server-side sorting control with manualSorting prop",status:"✅"},{feature:"Custom Columns",description:"Flexible column definitions with custom cell renderers",status:"✅"},{feature:"Pagination",description:"Progressive data loading with Load more and Load all actions",status:"✅"},{feature:"Search",description:"Global search input to filter rows across searchable columns",status:"✅"},{feature:"Filters",description:"Column-level filters with comparators, options and removable chips",status:"✅"},{feature:"Columns visiblity",description:"Toggle column visibility via a columns picker with Select all",status:"✅"},{feature:"Row selection",description:"Single or multi-row selection with a header master checkbox",status:"✅"},{feature:"Column Expandable",description:"Expandable rows to display hierarchical or nested data",status:"✅"},{feature:"Subcomponent",description:"Custom sub-rows to render additional content below a row",status:"✅"}]}}),`
`,e.jsx(a,{label:"Columns Definition",level:3}),`
`,e.jsxs(n.p,{children:["Column definitions are the foundation of the Datagrid component. They determine how data is extracted, displayed, sorted, filtered, and formatted in your table. The Datagrid uses ",e.jsx(n.a,{href:"https://tanstack.com/table/v8/docs/guide/column-defs",rel:"nofollow",children:"TanStack Table"})," column definitions, extended with additional properties for enhanced functionality."]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Column Types"})}),`
`,e.jsx(n.p,{children:"There are three main types of column definitions:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Accessor Columns"}),": Extract data from your data model and can be sorted, filtered, and grouped"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Display Columns"}),": Don't have a data model and are used for displaying arbitrary content (e.g., action buttons, checkboxes)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Grouping Columns"}),": Used to group other columns together under a common header"]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Basic Accessor Column"})}),`
`,e.jsxs(n.p,{children:["The simplest way to define a column is using ",e.jsx(n.code,{children:"accessorKey"})," to reference a property in your data:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`type Person = {
  id: string;
  name: string;
  age: number;
  email: string;
};

const columns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    label: 'Name',
    isSortable: true,
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
    label: 'Age',
    isSortable: true,
  },
];
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Accessor Function"})}),`
`,e.jsxs(n.p,{children:["For computed or nested values, use ",e.jsx(n.code,{children:"accessorFn"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns: DatagridColumn<Person>[] = [
  {
    id: 'fullName',
    accessorFn: (row) => \`\${row.firstName} \${row.lastName}\`,
    header: 'Full Name',
    label: 'Full Name',
  },
  {
    id: 'profile',
    accessorFn: (row) => row.profile?.bio || 'No bio',
    header: 'Bio',
    label: 'Bio',
  },
];
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Custom Cell Rendering"})}),`
`,e.jsxs(n.p,{children:["Customize how cells are displayed using the ",e.jsx(n.code,{children:"cell"})," property:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    label: 'Name',
    cell: ({ getValue }) => (
      <strong>{getValue<string>()}</strong>
    ),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    label: 'Email',
    cell: ({ getValue }) => (
      <a href={\`mailto:\${getValue<string>()}\`}>
        {getValue<string>()}
      </a>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    label: 'Status',
    cell: ({ getValue }) => {
      const status = getValue<string>();
      return (
        <span className={status === 'active' ? 'text-green-500' : 'text-red-500'}>
          {status}
        </span>
      );
    },
  },
];
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Display Columns"})}),`
`,e.jsx(n.p,{children:"Display columns don't extract data but render custom content, perfect for action buttons or other UI elements:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    label: 'Name',
  },
  {
    id: 'actions',
    header: 'Actions',
    label: 'Actions',
    cell: ({ row }) => (
      <div>
        <button onClick={() => handleEdit(row.original)}>Edit</button>
        <button onClick={() => handleDelete(row.original.id)}>Delete</button>
      </div>
    ),
    isSortable: false,
    isFilterable: false,
  },
];
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Column Features"})}),`
`,e.jsx(n.p,{children:"Enable sorting, filtering, and search for your columns:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    label: 'Name',
    isSortable: true,      // Enable column sorting
    isFilterable: true,    // Enable column filtering
    isSearchable: true,    // Include in global search
    enableHiding: true,    // Allow column to be hidden
    type: FilterTypeCategories.String, // Filter type
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
    label: 'Age',
    isSortable: true,
    isFilterable: true,
    type: FilterTypeCategories.Numeric,
    cell: ({ getValue }) => <div>{getValue<number>()} years</div>,
  },
];
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Column Grouping"})}),`
`,e.jsx(n.p,{children:"Group related columns under a common header:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns: DatagridColumn<Person>[] = [
  {
    id: 'personalInfo',
    header: 'Personal Information',
    columns: [
      {
        id: 'firstName',
        accessorKey: 'firstName',
        header: 'First Name',
        label: 'First Name',
      },
      {
        id: 'lastName',
        accessorKey: 'lastName',
        header: 'Last Name',
        label: 'Last Name',
      },
    ],
  },
  {
    id: 'contactInfo',
    header: 'Contact Information',
    columns: [
      {
        id: 'email',
        accessorKey: 'email',
        header: 'Email',
        label: 'Email',
      },
      {
        id: 'phone',
        accessorKey: 'phone',
        header: 'Phone',
        label: 'Phone',
      },
    ],
  },
];
`})}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Complete Example"})}),`
`,e.jsx(n.p,{children:"Here's a complete example combining multiple column features:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
};

const columns: DatagridColumn<Product>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Product Name',
    label: 'Product Name',
    isSortable: true,
    isFilterable: true,
    isSearchable: true,
    enableHiding: true,
    type: FilterTypeCategories.String,
    cell: ({ getValue }) => (
      <div className="font-semibold">{getValue<string>()}</div>
    ),
  },
  {
    id: 'price',
    accessorKey: 'price',
    header: 'Price',
    label: 'Price',
    isSortable: true,
    isFilterable: true,
    type: FilterTypeCategories.Numeric,
    cell: ({ getValue }) => (
      <div>\${getValue<number>().toFixed(2)}</div>
    ),
  },
  {
    id: 'category',
    accessorKey: 'category',
    header: 'Category',
    label: 'Category',
    isFilterable: true,
    filterOptions: [
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' },
      { label: 'Food', value: 'food' },
    ],
  },
  {
    id: 'inStock',
    accessorFn: (row) => row.inStock,
    header: 'In Stock',
    label: 'In Stock',
    cell: ({ getValue }) => (
      <span className={getValue<boolean>() ? 'text-green-500' : 'text-red-500'}>
        {getValue<boolean>() ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    id: 'actions',
    header: 'Actions',
    label: 'Actions',
    cell: ({ row }) => (
      <button onClick={() => handleView(row.original)}>View</button>
    ),
    isSortable: false,
    isFilterable: false,
  },
];

<Datagrid columns={columns} data={products} />
`})}),`
`,e.jsxs(n.p,{children:["For more detailed information about column definitions, including advanced patterns and best practices, refer to the ",e.jsx(n.a,{href:"https://tanstack.com/table/v8/docs/guide/column-defs",rel:"nofollow",children:"TanStack Table Column Definitions Guide"}),"."]}),`
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
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns = [
  {
    id: 'person',
    label: 'Person',
    accessorKey: 'person',
    header: 'Person',
    enableHiding: true,
    comparator: FilterCategories.String,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  }
];
<Datagrid
  columns={columns}
  data={data}
  hasNextPage={true}
  onFetchNextPage={handleFetchNext}
  onFetchAllPages={handleFetchAll}
  isLoading={true} // Shows loading state
/>
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
`,e.jsx(a,{label:"Row selection",level:3}),`
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
`]})]})}function I(t={}){const{wrapper:n}={...l(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{I as default};
