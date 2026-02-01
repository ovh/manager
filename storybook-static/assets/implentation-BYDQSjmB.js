import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-CWIOTABv.js";import{b as l,S as a}from"./index-DcLqt6dN.js";import{M as r,C as o}from"./index-CExQY-2-.js";import c,{Default as d}from"./datagrid.stories-Do9Dgb46.js";import"./index-Bnop-kX6.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-B5_veLQO.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-B25DnDzc.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./MessageIcon-yhpEHWAg-CXHPnT2G.js";import"./ods-react236-aAAP9SXj.js";import"./ComboboxControl-sJOkWHeT-DJbuE-Pm.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./lib-D44cvI9Y-CkpjrNOq.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./Divider-THit99OS-BLm7oKDW.js";import"./index-DmiixKia.js";function s(t){const e={code:"code",p:"p",pre:"pre",strong:"strong",...i(),...t.components};return n.jsxs(n.Fragment,{children:[n.jsx(r,{title:"Manager UI Kit/Components/Datagrid/Implementation"}),`
`,n.jsx(l,{of:c}),`
`,n.jsx(o,{layout:"centered",of:d,sourceState:"none"}),`
`,n.jsx(a,{label:"Implementation Guide",level:2}),`
`,n.jsx(e.p,{children:"This guide will walk you through implementing the Datagrid component step by step, from basic setup to advanced features."}),`
`,n.jsx(a,{label:"Import the Component",level:3}),`
`,n.jsx(e.p,{children:"First, import the Datagrid component from the Manager UI Kit:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Datagrid } from '@ovh-ux/muk';
`})}),`
`,n.jsx(e.p,{children:"If you need additional types or utilities:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Datagrid, DatagridColumn } from '@ovh-ux/muk';
import { TABLE_SIZE } from '@ovhcloud/ods-react';
`})}),`
`,n.jsx(a,{label:"Define Columns",level:3}),`
`,n.jsx(e.p,{children:"Columns define the structure and behavior of your table. Each column can extract data, render custom content, and enable features like sorting and filtering."}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Basic Column Definition"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`type Person = {
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
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    label: 'Email',
  },
];
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Column Size"})}),`
`,n.jsx(e.p,{children:'The column "sizes" are stored in the table state as numbers, and are usually interpreted as pixel unit values, but you can hook up these column sizing values to your css styles however you see fit.'}),`
`,n.jsx(e.p,{children:"By default, the column.getCanResize() API will return true by default for all columns, but you can either disable column resizing for all columns with the enableColumnResizing table option, or disable column resizing on a per-column basis with the enableResizing column option."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`type Person = {
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
    //override default column sizing
    size: 30,  //set column size for this column
    enableResizing: false, //disable resizing for just this column
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
    label: 'Age',
    isSortable: true,
    //override default column sizing
    size: 30,  //set column size for this column
    enableResizing: false, //disable resizing for just this column
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    label: 'Email',
    //override default column sizing
    size: 30,  //set column size for this column
    enableResizing: false, //disable resizing for just this column
  },
];
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Add Action Buttons"})}),`
`,n.jsx(e.p,{children:"Create a display column for action buttons:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { ActionMenu } from '@ovh-ux/muk';
import { BUTTON_SIZE } from '@ovhcloud/ods-react';

const columns: DatagridColumn<Person>[] = [
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
      <ActionMenu
        size={BUTTON_SIZE.sm}
        id={\`actions-menu-\${row.original.id}\`}
        items={[
          {
            id: 'edit',
            label: 'Edit',
            onClick: () => handleEdit(row.original),
          },
          {
            id: 'delete',
            label: 'Delete',
            onClick: () => handleDelete(row.original.id),
          },
        ]}
        isCompact
      />
    ),
    isSortable: false,
    isFilterable: false,
  },
];
`})}),`
`,n.jsx(a,{label:"Data Parameter",level:3}),`
`,n.jsxs(e.p,{children:["The ",n.jsx(e.code,{children:"data"})," prop accepts an array of objects. The type should match your column definitions:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`type Person = {
  id: string;
  name: string;
  age: number;
  email: string;
};

const data: Person[] = [
  { id: '1', name: 'John Doe', age: 30, email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', age: 25, email: 'jane@example.com' },
  { id: '3', name: 'Bob Johnson', age: 35, email: 'bob@example.com' },
];

<Datagrid<Person> columns={columns} data={data} />
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Basic Usage"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
/>
`})}),`
`,n.jsx(a,{label:"Pagination - Load More & Load All",level:3}),`
`,n.jsxs(e.p,{children:['The Datagrid supports progressive data loading with "Load More" and "Load All" buttons. When using ',n.jsx(e.code,{children:"useDataApi"}),", pagination is handled automatically."]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Using useDataApi with Pagination"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useDataApi, Datagrid, DatagridColumn } from '@ovh-ux/muk';

type Server = {
  id: string;
  name: string;
  ip: string;
};

const ListingPage = () => {
  const {
    flattenData,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useDataApi<Server>({
    route: '/dedicated/server',
    version: 'v6',
    cacheKey: ['dedicated-server'],
    iceberg: true,
    enabled: true,
  });

  const columns: DatagridColumn<Server>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      label: 'Name',
    },
    {
      id: 'ip',
      accessorKey: 'ip',
      header: 'IP Address',
      label: 'IP Address',
    },
  ];

  // Simple implementation: fetch all remaining pages
  const handleFetchAllPages = async () => {
    // Keep fetching until there are no more pages
    while (hasNextPage) {
      await fetchNextPage();
    }
  };

  return (
    <Datagrid<Server>
      columns={columns}
      data={flattenData || []}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      onFetchNextPage={fetchNextPage}
      onFetchAllPages={handleFetchAllPages}
    />
  );
};
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Alternative: Using fetchAll Option"})}),`
`,n.jsxs(e.p,{children:["You can also use the ",n.jsx(e.code,{children:"fetchAll"})," option in ",n.jsx(e.code,{children:"useDataApi"})," to automatically fetch all pages on initial load:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const {
  flattenData,
  isLoading,
  fetchNextPage,
  hasNextPage,
} = useDataApi<Server>({
  route: '/dedicated/server',
  version: 'v6',
  cacheKey: ['dedicated-server'],
  iceberg: true,
  enabled: true,
  fetchAll: true, // Automatically fetches all pages
});

// When fetchAll is true, you typically don't need onFetchAllPages
<Datagrid
  columns={columns}
  data={flattenData || []}
  isLoading={isLoading}
  hasNextPage={hasNextPage}
  onFetchNextPage={fetchNextPage}
/>
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Manual Pagination (without useDataApi)"})}),`
`,n.jsxs(e.p,{children:["If you're not using ",n.jsx(e.code,{children:"useDataApi"}),", you can implement pagination manually:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const [hasNextPage, setHasNextPage] = useState(true);
const [currentPage, setCurrentPage] = useState(1);

const handleFetchNextPage = async () => {
  const nextPage = currentPage + 1;
  const newData = await fetchPage(nextPage);
  setData((prev) => [...prev, ...newData]);
  setCurrentPage(nextPage);
  setHasNextPage(newData.length > 0);
};

const handleFetchAllPages = async () => {
  const allData = await fetchAllPages();
  setData(allData);
  setHasNextPage(false);
};

<Datagrid
  columns={columns}
  data={data}
  hasNextPage={hasNextPage}
  onFetchNextPage={handleFetchNextPage}
  onFetchAllPages={handleFetchAllPages}
/>
`})}),`
`,n.jsx(a,{label:"Using useDataApi with V6 Iceberg Endpoint",level:3}),`
`,n.jsxs(e.p,{children:["The ",n.jsx(e.code,{children:"useDataApi"})," hook simplifies data fetching from OVHcloud API endpoints, especially with Iceberg pagination:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useDataApi, Datagrid } from '@ovh-ux/muk';
import { FilterCategories } from '@ovh-ux/manager-core-api';

const ListingPage = () => {
  const {
    flattenData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    sorting,
    filters,
  } = useDataApi({
    route: '/dedicated/server',
    version: 'v6',
    cacheKey: ['dedicated-server'],
    iceberg: true,
    enabled: true,
    columns: columns, // Optional: for automatic sorting/filtering
  });

  const columns: DatagridColumn<DedicatedServer>[] = [
    {
      id: 'name',
      label: 'Name',
      accessorKey: 'name',
      isSortable: true,
      isFilterable: true,
      comparator: FilterCategories.String,
      cell: ({ getValue }) => <div>{getValue<string>()}</div>,
    },
    {
      id: 'ip',
      label: 'IP',
      accessorKey: 'ip',
      isSortable: true,
      isFilterable: true,
      comparator: FilterCategories.String,
      cell: ({ getValue }) => <div>{getValue<string>()}</div>,
    },
  ];

  return (
    <Datagrid
      columns={columns}
      data={flattenData || []}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      onFetchNextPage={fetchNextPage}
      sorting={{
        sorting: sorting?.sorting ?? [],
        setSorting: sorting?.setSorting ?? (() => {}),
        manualSorting: true,
      }}
      filters={{
        filters: filters?.filters ?? [],
        add: filters?.add ?? (() => {}),
        remove: filters?.remove ?? (() => {}),
      }}
    />
  );
};
`})}),`
`,n.jsx(a,{label:"Add Sorting",level:3}),`
`,n.jsx(e.p,{children:"Enable sorting for your columns and manage sorting state:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { SortingState } from '@tanstack/react-table';

const [sorting, setSorting] = useState<SortingState>([]);

const columns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    label: 'Name',
    isSortable: true, // Enable sorting for this column
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
    label: 'Age',
    isSortable: true,
  },
];

<Datagrid
  columns={columns}
  data={data}
  sorting={{
    sorting,
    setSorting,
    manualSorting: false, // false = client-side, true = server-side
  }}
/>
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Server-side Sorting"})}),`
`,n.jsxs(e.p,{children:["For server-side sorting, set ",n.jsx(e.code,{children:"manualSorting: true"})," and handle sorting in your data fetching logic:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const [sorting, setSorting] = useState<SortingState>([]);

const handleSortChange = (newSorting: SortingState) => {
  setSorting(newSorting);
  // Trigger API call with new sorting parameters
  fetchData({ sortBy: newSorting });
};

<Datagrid
  columns={columns}
  data={data}
  sorting={{
    sorting,
    setSorting: handleSortChange,
    manualSorting: true, // Server handles sorting
  }}
/>
`})}),`
`,n.jsx(a,{label:"Column Visibility",level:3}),`
`,n.jsx(e.p,{children:"Allow users to show/hide columns dynamically:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { VisibilityState } from '@tanstack/react-table';

const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

const columns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    label: 'Name',
    enableHiding: true, // Allow this column to be hidden
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
    label: 'Age',
    enableHiding: true,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    label: 'Email',
    enableHiding: true,
  },
];

<Datagrid
  columns={columns}
  data={data}
  columnVisibility={{
    columnVisibility,
    setColumnVisibility,
  }}
/>
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Column Visibility with Conditions"})}),`
`,n.jsx(e.p,{children:"Control which columns can be hidden based on conditions:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const columns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    label: 'Name',
    enableHiding: true,
  },
  {
    id: 'id',
    accessorKey: 'id',
    header: 'ID',
    label: 'ID',
    enableHiding: false, // This column cannot be hidden
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    label: 'Email',
    enableHiding: true,
  },
];
`})}),`
`,n.jsx(a,{label:"Filters Implementation",level:3}),`
`,n.jsx(e.p,{children:"Add column-level filters with comparators and options:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useColumnFilters } from '@ovh-ux/muk';
import { FilterCategories } from '@ovh-ux/manager-core-api';

const { filters, add, remove } = useColumnFilters();

const columns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    label: 'Name',
    isFilterable: true,
    comparator: FilterCategories.String,
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
    label: 'Age',
    isFilterable: true,
    comparator: FilterCategories.Numeric,
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    label: 'Status',
    isFilterable: true,
    filterOptions: [
      { label: 'Active', value: 'active' },
      { label: 'Inactive', value: 'inactive' },
      { label: 'Pending', value: 'pending' },
    ],
  },
];

<Datagrid
  columns={columns}
  data={data}
  enableFilter
  filters={{
    filters,
    add,
    remove,
  }}
  resourceType="person"
/>
`})}),`
`,n.jsx(a,{label:"Search Implementation",level:3}),`
`,n.jsx(e.p,{children:"Enable global search across searchable columns:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const [searchInput, setSearchInput] = useState('');

const handleSearch = (value: string) => {
  setSearchInput(value);
  // Implement your search logic here
  // For client-side: filter data
  // For server-side: trigger API call
};

const columns: DatagridColumn<Person>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: 'Name',
    label: 'Name',
    isSearchable: true, // Include in global search
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    label: 'Email',
    isSearchable: true,
  },
  {
    id: 'age',
    accessorKey: 'age',
    header: 'Age',
    label: 'Age',
    isSearchable: false, // Exclude from search
  },
];

<Datagrid
  columns={columns}
  data={data}
  enableSearch
  search={{
    searchInput,
    setSearchInput,
    onSearch: handleSearch,
    placeholder: 'Search by name or email...',
  }}
/>
`})}),`
`,n.jsx(a,{label:"Add Topbar",level:3}),`
`,n.jsx(e.p,{children:"Add custom content to the topbar (appears above the table):"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
  topbar={
    <div className="flex items-center justify-between p-4 bg-gray-100">
      <h3 className="text-lg font-semibold">Custom Topbar</h3>
      <button onClick={handleExport}>Export</button>
    </div>
  }
/>
`})}),`
`,n.jsx(e.p,{children:"The topbar automatically appears when you enable search, filters, or column visibility features. You can also add custom content alongside these features."}),`
`,n.jsx(a,{label:"Loading State",level:3}),`
`,n.jsx(e.p,{children:"Show loading indicators while data is being fetched:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const result = await api.getData();
    setData(result);
  } finally {
    setIsLoading(false);
  }
};

<Datagrid
  columns={columns}
  data={data}
  isLoading={isLoading}
  hasNextPage={hasNextPage}
  onFetchNextPage={handleFetchNextPage}
/>
`})}),`
`,n.jsxs(e.p,{children:["When using ",n.jsx(e.code,{children:"useDataApi"}),", the loading state is automatically managed:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const { flattenData, isLoading, fetchNextPage, hasNextPage } = useDataApi({
  route: '/dedicated/server',
  version: 'v6',
  iceberg: true,
});

<Datagrid
  columns={columns}
  data={flattenData || []}
  isLoading={isLoading}
  hasNextPage={hasNextPage}
  onFetchNextPage={fetchNextPage}
/>
`})}),`
`,n.jsx(a,{label:"Expandable Rows",level:3}),`
`,n.jsxs(e.p,{children:["Display hierarchical data with expandable rows using the ",n.jsx(e.code,{children:"subRows"})," property:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { ExpandedState } from '@tanstack/react-table';

type PersonWithSubRows = {
  id: string;
  name: string;
  age: number;
  subRows?: PersonWithSubRows[];
};

const [expanded, setExpanded] = useState<ExpandedState>({});

const data: PersonWithSubRows[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 30,
    subRows: [
      { id: '1-1', name: 'Sub Item 1', age: 25 },
      { id: '1-2', name: 'Sub Item 2', age: 28 },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    age: 25,
    subRows: [
      { id: '2-1', name: 'Sub Item 3', age: 22 },
    ],
  },
];

<Datagrid<PersonWithSubRows>
  columns={columns}
  data={data}
  expandable={{
    expanded,
    setExpanded,
    getRowCanExpand: (row) => {
      // Optional: conditionally allow expansion
      return row.original.subRows && row.original.subRows.length > 0;
    },
  }}
/>
`})}),`
`,n.jsx(a,{label:"Render SubComponent",level:3}),`
`,n.jsx(e.p,{children:"Render custom content below a row (different from expandable sub-rows):"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
  renderSubComponent={(row) => (
    <div className="p-4 bg-gray-50">
      <h4 className="font-semibold">Details for {row.original.name}</h4>
      <p>Age: {row.original.age}</p>
      <p>Email: {row.original.email}</p>
      <button onClick={() => handleViewDetails(row.original)}>
        View Full Details
      </button>
    </div>
  )}
  subComponentHeight={100} // Height in pixels
/>
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"You can not combine renderSubComponent with Expandable Rows"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`
<StorybookHeading label="Row Selection Implementation" level={3} />

Enable single or multi-row selection:

\`\`\`tsx
import { RowSelectionState } from '@tanstack/react-table';

const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

const handleSelectionChange = (selectedRows: Person[]) => {
  console.log('Selected rows:', selectedRows);
  // Handle selection logic
};

<Datagrid
  columns={columns}
  data={data}
  rowSelection={{
    rowSelection,
    setRowSelection,
    enableRowSelection: (row) => {
      // Optional: conditionally allow selection
      return row.original.age >= 18;
    },
    onRowSelectionChange: handleSelectionChange,
  }}
/>
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Access Selected Rows"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`const selectedRowIds = Object.keys(rowSelection);
const selectedRows = data.filter((_, index) => 
  rowSelection[index.toString()]
);

console.log('Selected:', selectedRows);
`})}),`
`,n.jsx(a,{label:"Hide Header Feature",level:3}),`
`,n.jsx(e.p,{children:"Hide the table header when you don't need column headers:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`<Datagrid
  columns={columns}
  data={data}
  hideHeader={true}
/>
`})}),`
`,n.jsx(e.p,{children:"This is useful for compact displays or when column headers are not needed. The container height will automatically adjust when the header is hidden."}),`
`,n.jsx(a,{label:"Complete Example",level:3}),`
`,n.jsx(e.p,{children:"Here's a complete example combining multiple features:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useState } from 'react';
import { 
  Datagrid, 
  DatagridColumn, 
  useDataApi 
} from '@ovh-ux/muk';
import { 
  VisibilityState, 
  RowSelectionState, 
  ExpandedState,
  SortingState 
} from '@tanstack/react-table';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { TABLE_SIZE } from '@ovhcloud/ods-react';

type Server = {
  id: string;
  name: string;
  ip: string;
  status: string;
  subRows?: Server[];
};

const ServerListing = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [sorting, setSorting] = useState<SortingState>([]);

  const {
    flattenData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    sorting: apiSorting,
    filters,
  } = useDataApi<Server>({
    route: '/dedicated/server',
    version: 'v6',
    cacheKey: ['dedicated-server'],
    iceberg: true,
    enabled: true,
  });

  const columns: DatagridColumn<Server>[] = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      label: 'Name',
      isSortable: true,
      isFilterable: true,
      isSearchable: true,
      enableHiding: true,
      comparator: FilterCategories.String,
      cell: ({ getValue }) => <div className="font-semibold">{getValue<string>()}</div>,
    },
    {
      id: 'ip',
      accessorKey: 'ip',
      header: 'IP Address',
      label: 'IP Address',
      isSortable: true,
      isFilterable: true,
      isSearchable: true,
      enableHiding: true,
      comparator: FilterCategories.String,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      label: 'Status',
      isFilterable: true,
      filterOptions: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      cell: ({ getValue }) => {
        const status = getValue<string>();
        return (
          <span className={status === 'active' ? 'text-green-500' : 'text-red-500'}>
            {status}
          </span>
        );
      },
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

  return (
    <Datagrid<Server>
      columns={columns}
      data={flattenData || []}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      onFetchNextPage={fetchNextPage}
      size={TABLE_SIZE.md}
      columnVisibility={{
        columnVisibility,
        setColumnVisibility,
      }}
      sorting={{
        sorting: apiSorting?.sorting ?? sorting,
        setSorting: apiSorting?.setSorting ?? setSorting,
        manualSorting: true,
      }}
      filters={{
        filters: filters?.filters ?? [],
        add: filters?.add ?? (() => {}),
        remove: filters?.remove ?? (() => {}),
      }}
      rowSelection={{
        rowSelection,
        setRowSelection,
      }}
      expandable={{
        expanded,
        setExpanded,
      }}
      renderSubComponent={(row) => (
        <div className="p-4">
          <p>Server ID: {row.original.id}</p>
          <p>Details for {row.original.name}</p>
        </div>
      )}
      subComponentHeight={80}
    />
  );
};

export default ServerListing;
`})})]})}function L(t={}){const{wrapper:e}={...i(),...t.components};return e?n.jsx(e,{...t,children:n.jsx(s,{...t})}):s(t)}export{L as default};
