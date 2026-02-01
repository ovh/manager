import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-CWIOTABv.js";import{M as s}from"./index-CExQY-2-.js";import{S as t}from"./index-DcLqt6dN.js";import"./index-Bnop-kX6.js";import"./iframe-B25DnDzc.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-B5_veLQO.js";import"./index-2w0W-O47-BJ19ihbZ.js";function i(a){const n={code:"code",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Manager UI Kit/Hooks/useDataApi"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"useDataApi"})," hook is a unified data fetching utility that provides a consistent interface for working with different OVHcloud API versions. It automatically routes to the appropriate adapter (Iceberg, v2, or v6) based on the configuration provided."]}),`
`,e.jsx(t,{label:"Features",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["🔄 ",e.jsx(n.strong,{children:"Multi-version support"}),": Works with Iceberg, API v2, and API v6"]}),`
`,e.jsxs(n.li,{children:["📦 ",e.jsx(n.strong,{children:"Automatic routing"}),": Selects the correct adapter based on configuration"]}),`
`,e.jsxs(n.li,{children:["⚡ ",e.jsx(n.strong,{children:"React Query integration"}),": Built on React Query for efficient caching and state management"]}),`
`,e.jsxs(n.li,{children:["🔍 ",e.jsx(n.strong,{children:"Search capabilities"}),": Available with Iceberg adapter"]}),`
`,e.jsxs(n.li,{children:["🎯 ",e.jsx(n.strong,{children:"Filter management"}),": Available with Iceberg adapter"]}),`
`,e.jsxs(n.li,{children:["📊 ",e.jsx(n.strong,{children:"Sorting support"}),": Available with Iceberg and v6 adapters"]}),`
`,e.jsxs(n.li,{children:["📥 ",e.jsx(n.strong,{children:"Pagination"}),": Supports infinite queries and fetching all data at once"]}),`
`,e.jsxs(n.li,{children:["🔄 ",e.jsx(n.strong,{children:"Auto-refetch"}),": Configurable refetch intervals for v6 adapter"]}),`
`]}),`
`,e.jsx(t,{label:"Adapter Selection",level:2}),`
`,e.jsx(n.p,{children:"The hook automatically selects the appropriate adapter based on the following logic:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Iceberg"}),": Used when ",e.jsx(n.code,{children:"iceberg: true"})," is provided"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"v2"}),": Used when ",e.jsx(n.code,{children:"version: 'v2'"})," and ",e.jsx(n.code,{children:"iceberg"})," is not set"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"v6"}),": Used by default when ",e.jsx(n.code,{children:"version: 'v6'"})," (or not specified) and ",e.jsx(n.code,{children:"iceberg"})," is not set"]}),`
`]}),`
`,e.jsx(t,{label:"Parameters",level:2}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`type UseDataApiOptions<TData = Record<string, unknown>> = {
  /** API endpoint route */
  route?: string;
  /** API version to use ('v2' | 'v6') */
  version: 'v2' | 'v6';
  /** Enable Iceberg adapter */
  iceberg?: boolean;
  /** Unique cache key for React Query */
  cacheKey: string | string[];
  /** Enable or disable the query */
  enabled?: boolean;
  /** Refetch interval in milliseconds (v6 only) */
  refetchInterval?: number | false;
  /** Number of items per page */
  pageSize?: number;
  /** Initial sorting configuration */
  defaultSorting?: SortingState;
  /** Fetch all data at once */
  fetchAll?: boolean;
  /** Disable caching */
  disableCache?: boolean;
  /** Column definitions for datagrid (Iceberg and v6) */
  columns?: DatagridColumn<TData>[];
  /** Custom fetch function (v6 only) */
  fetchDataFn?: (route: string) => Promise<{ data: TData[] }>;
};
`})}),`
`,e.jsx(t,{label:"Returns",level:2}),`
`,e.jsx(n.p,{children:"The hook returns an object with the following properties:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`type UseDataApiResult<TData = Record<string, unknown>> = {
  // React Query properties
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error: Error | null;
  status: 'idle' | 'loading' | 'success' | 'error';
  refetch: () => void;
  
  // Pagination
  hasNextPage: boolean;
  fetchNextPage: () => void;
  pageIndex?: number;
  totalCount?: number;
  
  // Data
  flattenData: TData[];
  
  // Sorting (Iceberg and v6)
  sorting?: {
    sorting: SortingState;
    setSorting: Dispatch<SetStateAction<SortingState>>;
    manualSorting: boolean;
  };
  
  // Filters (Iceberg only)
  filters?: {
    filters: FilterWithLabel[];
    add: (filter: FilterWithLabel) => void;
    remove: (filter: Filter) => void;
  };
  
  // Search (Iceberg only)
  search?: {
    onSearch: (search: string | undefined) => void;
    searchInput: string;
    setSearchInput: Dispatch<SetStateAction<string>>;
  };
};
`})}),`
`,e.jsx(t,{label:"Examples",level:2}),`
`,e.jsx(t,{label:"Basic Usage with v6",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useDataApi } from '@ovh-ux/manager-ui-kit';

interface MyResource {
  id: string;
  name: string;
  status: string;
}

const columns = [
  {
    id: 'name',
    label: 'name',
    accessorKey: 'name',
    isSortable: true,
    cell: ({ getValue }: any) => <div>{getValue()}</div>,
  },
  {
    id: 'ip',
    label: 'ip',
    accessorKey: 'ip',
    isSortable: true,
    cell: ({ getValue }: any) => <div>{getValue()}</div>,
  },
]

function MyComponent() {
  const {
    flattenData,
    isLoading,
    isError,
    error,
  } = useDataApi<MyResource>({
    route: '/api/v6/my-resources',
    version: 'v6',
    cacheKey: ['my-resources'],
    enabled: true,
    columns: columns,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error?.message}</div>;

  return (
    <ul>
      {flattenData.map((resource) => (
        <li key={resource.id}>{resource.name}</li>
      ))}
    </ul>
  );
}
`})}),`
`,e.jsx(t,{label:"Using v2 API",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`function MyComponent() {
  const {
    flattenData,
    isLoading,
    hasNextPage,
    fetchNextPage,
  } = useDataApi({
    route: '/api/v2/my-resources',
    version: 'v2',
    cacheKey: ['my-resources-v2'],
    pageSize: 20,
    enabled: true,
  });

  return (
    <div>
      <ul>
        {flattenData.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          Load More
        </button>
      )}
    </div>
  );
}
`})}),`
`,e.jsx(t,{label:"Using Iceberg with Search and Filters",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`function MyComponent() {
  const {
    flattenData,
    sorting,
    filters,
    search,
    isLoading,
  } = useDataApi({
    route: '/api/v2/my-resources',
    version: 'v2',
    iceberg: true,
    cacheKey: ['my-resources-iceberg'],
    columns: [
      { id: 'name', isSearchable: true, isFilterable: true },
      { id: 'status', isFilterable: true },
    ],
    defaultSorting: [{ id: 'name', desc: false }],
    enabled: true,
  });

  return (
    <div>
      {/* Search input */}
      <input
        value={search?.searchInput || ''}
        onChange={(e) => {
          search?.setSearchInput(e.target.value);
          search?.onSearch(e.target.value);
        }}
        placeholder="Search..."
      />

      {/* Filters */}
      <button
        onClick={() => {
          filters?.add({
            key: 'status',
            value: 'active',
            comparator: 'equals',
            label: 'Status: Active',
          });
        }}
      >
        Filter by Active Status
      </button>

      {/* Data table */}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {flattenData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
`})}),`
`,e.jsx(t,{label:"Using Custom Fetch Function (v6)",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`function MyComponent() {
  const { flattenData, isLoading } = useDataApi({
    version: 'v6',
    cacheKey: ['custom-resources'],
    fetchDataFn: async (route) => {
      const response = await fetch(route);
      const json = await response.json();
      return { data: json.items };
    },
    enabled: true,
    columns,
  });

  // ...
}
`})}),`
`,e.jsx(t,{label:"Conditional Fetching",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`function MyComponent({ shouldFetch }: { shouldFetch: boolean }) {
  const { flattenData, isLoading } = useDataApi({
    route: '/api/v6/my-resources',
    version: 'v6',
    cacheKey: ['my-resources'],
    enabled: shouldFetch, // Only fetch when shouldFetch is true
  });

  // ...
}
`})}),`
`,e.jsx(t,{label:"Auto-refetch with Interval (v6)",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`function MyComponent() {
  const { flattenData, isLoading } = useDataApi({
    route: '/api/v6/my-resources',
    version: 'v6',
    cacheKey: ['my-resources'],
    refetchInterval: 5000, // Refetch every 5 seconds
    columns,
  });

  // ...
}
`})}),`
`,e.jsx(t,{label:"Notes",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"⚡ The hook uses React Query under the hood for efficient data caching and state management"}),`
`,e.jsxs(n.li,{children:["🔄 When using Iceberg adapter, search and filter capabilities are available for columns marked with ",e.jsx(n.code,{children:"isSearchable"})," and ",e.jsx(n.code,{children:"isFilterable"})]}),`
`,e.jsxs(n.li,{children:["📥 The ",e.jsx(n.code,{children:"fetchAll"})," option will automatically fetch all available data, bypassing pagination"]}),`
`,e.jsx(n.li,{children:"🔍 Search functionality is only available with the Iceberg adapter"}),`
`,e.jsx(n.li,{children:"🎯 Filter functionality is only available with the Iceberg adapter"}),`
`,e.jsx(n.li,{children:"📊 Sorting is available with both Iceberg and v6 adapters"}),`
`,e.jsxs(n.li,{children:["🔄 The ",e.jsx(n.code,{children:"refetchInterval"})," option is only available with the v6 adapter"]}),`
`,e.jsxs(n.li,{children:["📦 The ",e.jsx(n.code,{children:"fetchDataFn"})," option is only available with the v6 adapter and allows you to provide a custom data fetching function"]}),`
`]})]})}function f(a={}){const{wrapper:n}={...r(),...a.components};return n?e.jsx(n,{...a,children:e.jsx(i,{...a})}):i(a)}export{f as default};
