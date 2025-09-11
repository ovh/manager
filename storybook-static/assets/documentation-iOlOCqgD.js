import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-B3brjphm.js";import{M as o}from"./index-y5n-9ldd.js";import{S as t}from"./index-CnodGBIp.js";import"./index-Bnop-kX6.js";import"./iframe-8U4jGQrW.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-PzEU9Mdi.js";import"./index-oX_7i0mk.js";function r(a){const n={code:"code",li:"li",p:"p",pre:"pre",ul:"ul",...i(),...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/Hooks/useResourcesIcebergV6"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.code,{children:"useResourcesIcebergV6"})," hook is a data fetching utility designed to work with OVHcloud's Iceberg API v6. It provides a complete solution for handling paginated data, sorting, filtering, and searching capabilities."]}),`
`,e.jsx(t,{label:"Features",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Infinite scrolling support"}),`
`,e.jsx(n.li,{children:"Sorting functionality"}),`
`,e.jsx(n.li,{children:"Column-based filtering"}),`
`,e.jsx(n.li,{children:"Search capabilities"}),`
`,e.jsx(n.li,{children:"Automatic pagination handling"}),`
`,e.jsx(n.li,{children:"React Query integration for efficient data caching"}),`
`]}),`
`,e.jsx(t,{label:"Api",level:2}),`
`,e.jsx(t,{label:"Parameters",level:3}),`
`,e.jsx(n.p,{children:"The hook accepts the following parameters:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`interface IcebergV6Hook<T> {
  route: string;                    // The API endpoint to fetch data from
  pageSize?: number;               // Number of items per page (default: from defaultPageSize)
  queryKey: string[];             // Unique key for React Query cache
  defaultSorting?: ColumnSort;    // Initial sorting configuration
  shouldFetchAll?: boolean;       // Whether to fetch all data at once
  columns?: DatagridColumn<T>[];  // Column definitions for searchable fields
  disableCache?: boolean;         // Option to disable React Query caching
}
`})}),`
`,e.jsx(t,{label:"Return Value",level:3}),`
`,e.jsx(n.p,{children:"The hook returns an object with the following properties:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`{
  data: {
    pages: T[][];           // Array of pages containing the fetched data
    pageParams: number[];   // Array of page numbers that have been fetched
  };
  pageIndex: number;        // Current page index
  totalCount: number;       // Total number of items available
  flattenData: T[];         // All fetched data flattened into a single array
  hasNextPage: boolean;     // Whether there are more pages to fetch
  fetchNextPage: () => void; // Function to fetch the next page
  sorting: ColumnSort;      // Current sorting configuration
  setSorting: (sort: ColumnSort) => void; // Function to update sorting
  filters: {
    filters: Filter[];      // Current active filters
    add: (filter: Filter) => void;    // Function to add a filter
    remove: (filter: Filter) => void; // Function to remove a filter
  };
  search: {
    onSearch: (search: string) => void; // Function to trigger search
    searchInput: string;    // Current search input value
    setSearchInput: (value: string) => void; // Function to update search input
  };
}
`})}),`
`,e.jsx(t,{label:"Example Usage",level:3}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { useResourcesIcebergV6 } from '@ovh-ux/manager-react-components';

function MyComponent() {
  const {
    data,
    totalCount,
    sorting,
    setSorting,
    filters,
    search,
  } = useResourcesIcebergV6({
    route: '/api/v6/my-resources',
    queryKey: ['my-resources'],
    pageSize: 10,
    columns: [
      {
        id: 'name',
        isSearchable: true,
      },
    ],
  });
`})}),`
`,e.jsx(t,{label:"Notes",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The hook uses React Query under the hood for efficient data caching and state management"}),`
`,e.jsx(n.li,{children:"When `shouldFetchAll` is true, it will automatically fetch all available data"}),`
`,e.jsx(n.li,{children:"Search functionality requires at least one column to be marked as `isSearchable`"}),`
`,e.jsx(n.li,{children:"The hook automatically handles pagination and will fetch more data as needed when `fetchNextPage` is called"}),`
`]})]})}function b(a={}){const{wrapper:n}={...i(),...a.components};return n?e.jsx(n,{...a,children:e.jsx(r,{...a})}):r(a)}export{b as default};
