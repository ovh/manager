import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-DPS7WMVx.js";import{M as s}from"./index-BFtQ6RIa.js";import{S as t}from"./index-CEOMqFJg.js";import"./index-Bnop-kX6.js";import"./iframe-cf8KLDhX.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";function a(r){const n={blockquote:"blockquote",code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...i(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Manager React Components/Hooks/useResourcesIcebergV2"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"useResourcesIcebergV2"})," hook is a data fetching utility designed to work with OVHcloud's Iceberg API v2. It provides a solution for handling pagination, searching, filtering and sorting capabilities."]}),`
`,e.jsx(t,{label:"Features",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"🔄 Sorting functionality"}),`
`,e.jsx(n.li,{children:"🔍 Search capabilities with configurable searchable columns"}),`
`,e.jsx(n.li,{children:"🎯 Filter management system"}),`
`,e.jsx(n.li,{children:"📦 Automatic data flattening"}),`
`,e.jsx(n.li,{children:"⚡ React Query integration for efficient data caching"}),`
`,e.jsx(n.li,{children:"📥 Support for fetching all data at once"}),`
`]}),`
`,e.jsx(t,{label:"Api",level:2}),`
`,e.jsx(t,{label:"Parameters",level:3}),`
`,e.jsx(n.p,{children:"The hook accepts the following parameters:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`interface IcebergV2HookParams<T> {
  route: string;                    // The API endpoint to fetch data from
  pageSize?: number;               // Number of items per page (default: from defaultPageSize)
  queryKey: string[];             // Unique key for React Query cache
  defaultSorting?: ColumnSort;    // Initial sorting configuration
  shouldFetchAll?: boolean;       // Whether to fetch all data at once
  columns?: DatagridColumn<T>[];  // Column definitions for the datagrid
  ...options: UseInfiniteQueryOptions // Additional React Query options
}
`})}),`
`,e.jsx(t,{label:"Return Value",level:3}),`
`,e.jsx(n.p,{children:"The hook returns an object with the following properties:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`{
  flattenData: T[];                // All fetched data flattened into a single array
  setSorting: (sort: ColumnSort) => void; // Function to update sorting
  sorting: ColumnSort;             // Current sorting configuration
  filters: {
    filters: IcebergFilter[];      // Current active filters
    add: (filter: IcebergFilter) => void; // Function to add a filter
    remove: (filter: IcebergFilter) => void; // Function to remove an existing filter
  };
  search: {
    onSearch: (search: string) => void; // Function to trigger search
    searchInput: string;           // Current search input value
    setSearchInput: (value: string) => void; // Function to update search input
  };
  data: InfiniteData<IcebergFetchResultV2<T>>; // Raw query data
  hasNextPage: boolean;            // Whether there are more pages to fetch
  fetchNextPage: () => void;       // Function to fetch the next page
  isError: boolean;                // Whether the query encountered an error
  isLoading: boolean;              // Whether the query is loading
  error: Error | null;             // Error object if query failed
  status: 'idle' | 'loading' | 'success' | 'error'; // Query status
}
`})}),`
`,e.jsx(t,{label:"Example Usage",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';

function MyComponent() {
  const {
    flattenData,
    sorting,
    setSorting,
    filters,
    search,
    hasNextPage,
    fetchNextPage,
  } = useResourcesIcebergV2({
    route: '/api/v2/my-resources',
    queryKey: ['my-resources'],
    pageSize: 10,
    columns: [
      { id: 'name', isSearchable: true },
      { id: 'status' }
    ],
  });
}
`})}),`
`,e.jsx(t,{label:"Search",level:4}),`
`,e.jsxs(n.p,{children:["🔍 Search functionality is available for columns marked as searchable. To enable search for a column, add the ",e.jsx(n.code,{children:"isSearchable"})," property to your column definition:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns = [
  { id: 'name', isSearchable: true },
  { id: 'status' }
];
`})}),`
`,e.jsx(n.p,{children:"The search object provides the following methods:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`search: {
  onSearch: (search: string) => void;    // Triggers the search with the current input
  searchInput: string;                   // Current search input value
  setSearchInput: (value: string) => void; // Updates the search input
}
`})}),`
`,e.jsx(n.p,{children:"Example of implementing a search input:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`function SearchComponent() {
  const { search } = useResourcesIcebergV2({
    // ... other config
    columns: [{ id: 'name', isSearchable: true }]
  });

  return (
    <input
      value={search.searchInput}
      onChange={(e) => {
        search.setSearchInput(e.target.value);
        search.onSearch(e.target.value);
      }}
    />
  );
}
`})}),`
`,e.jsx(t,{label:"Filters",level:4}),`
`,e.jsxs(n.p,{children:["🎯 Filter functionality is available for columns marked as filterable. To enable search for a column, add the ",e.jsx(n.code,{children:"isFilterable"})," property to your column definition:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns = [
  { id: 'name', isFilterable: true },
  { id: 'status' }
];
`})}),`
`,e.jsx(n.p,{children:"Filters can be added and removed dynamically. Each filter is an object with the following structure:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`interface IcebergFilter {
  key: string;           // The field to filter on
  value: string | string[]; // The value(s) to filter by
  comparator: FilterComparator; // The comparison operator
  label: string;         // Display label for the filter
}
`})}),`
`,e.jsx(n.p,{children:"Available comparators:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`enum FilterComparator {
  Equals = 'equals',
  NotEquals = 'notEquals',
  GreaterThan = 'greaterThan',
  LessThan = 'lessThan',
  GreaterThanOrEqual = 'greaterThanOrEqual',
  LessThanOrEqual = 'lessThanOrEqual',
  Includes = 'includes',
  NotIncludes = 'notIncludes',
  StartsWith = 'startsWith',
  EndsWith = 'endsWith',
  IsNull = 'isNull',
  IsNotNull = 'isNotNull'
}
`})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["⚠️ API V2 with iceberg don't allow use to filter ",e.jsx(n.code,{children:"UUID"})," attributes"]}),`
`]}),`
`,e.jsx(t,{label:"Notes",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["⚡ The hook uses React Query's ",e.jsx(n.code,{children:"useInfiniteQuery"})," under the hood for efficient data caching and state management"]}),`
`,e.jsxs(n.li,{children:["📥 When ",e.jsx(n.code,{children:"shouldFetchAll"})," is true, it will automatically fetch all available data"]}),`
`,e.jsx(n.li,{children:"📦 The hook automatically flattens the paginated data into a single array for easier consumption"}),`
`,e.jsxs(n.li,{children:["🔍 Search functionality is only available for columns marked with ",e.jsx(n.code,{children:"isSearchable: true"})]}),`
`,e.jsx(n.li,{children:"🎯 Filters can be added and removed dynamically, and they are automatically included in the API requests"}),`
`,e.jsxs(n.li,{children:["🔄 The search functionality uses the ",e.jsx(n.code,{children:"FilterComparator.Includes"})," operator by default"]}),`
`]})]})}function j(r={}){const{wrapper:n}={...i(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(a,{...r})}):a(r)}export{j as default};
