import{j as a}from"./jsx-runtime-BRNY0I4F.js";import{r as h}from"./index-Bnop-kX6.js";import{e as Ie,f as xe,g as Re,b as Fe}from"./index-CfBVofaQ.js";import{K as ve}from"./index-CtYEMXh8.js";import{T as v,P as Ae,f as Me,d as De,Y as $e,g as $,F as ke}from"./manager-react-components-lib.es-D10R8NuD.js";import{c as i,a as Ne,b as Ve,d as Oe,e as _e}from"./datagrid.mock-Bx2othlO.js";import"./index-D0sJu8id.js";import"./iframe-SQQI24zp.js";import"./QueryClientProvider-DbnhbVMg.js";import"./context-BVP_XnaJ.js";import"./useTranslation-DdcBeAG-.js";const s=10,k=3,r=e=>{const[n,R]=h.useState(),[t,c]=h.useState(e.items),[A]=De(),{filters:x,addFilter:de,removeFilter:Se}=$e(),[M,be]=h.useState(""),[fe,ye]=h.useState({}),we=()=>{const o=t==null?void 0:t.length,l=[...Array(s).keys()].map((g,F)=>({label:`Item #${F+o}`,price:Math.floor(1+Math.random()*100)}));c(g=>[...g,...l])},Pe=()=>{const o=t==null?void 0:t.length,l=[...Array(s*k-o).keys()].map((g,F)=>({label:`Item #${F+o}`,price:Math.floor(1+Math.random()*100)}));c(g=>[...g,...l])},D=h.useMemo(()=>{var o;return(o=e==null?void 0:e.columns)==null?void 0:o.find(l=>Object.prototype.hasOwnProperty.call(l,"isSearchable"))},[i]),Ce=o=>{if(D){const l=$(e.items,!o||o.length===0?x:[{key:D.id,value:M,comparator:ke.Includes},...x]);c(l)}};return a.jsxs(a.Fragment,{children:[`${A}`&&a.jsxs(a.Fragment,{children:[a.jsxs("pre",{children:["Search params: ?",`${A}`]}),a.jsx(xe,{})]}),a.jsx(v,{items:$(t,x),columns:e.columns,hasNextPage:(t==null?void 0:t.length)&&t.length<k*s,onFetchNextPage:we,onFetchAllPages:Pe,totalItems:t==null?void 0:t.length,filters:{filters:x,add:de,remove:Se},columnVisibility:e.columnVisibility,onColumnVisibilityChange:e.onColumnVisibilityChange,topbar:e.topbar,isLoading:e.isLoading,...e.search?{search:{searchInput:M,setSearchInput:be,onSearch:Ce}}:{},getRowCanExpand:e.getRowCanExpand,renderSubComponent:e.renderSubComponent,...e.isSortable?{sorting:n,onSortChange:R,manualSorting:!1}:{},rowSelection:e.rowSelection?{rowSelection:fe,setRowSelection:ye,enableRowSelection:e.enableRowSelection,onToggleAllRowsSelection:e.onToggleAllRowsSelection,onRowSelectionChange:e.onRowSelectionChange}:void 0})]})},p=r.bind({});p.args={columns:i,items:[...Array(s).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),totalItems:20,isSortable:!1,onFetchNextPage:!0};const u=r.bind({});u.args={columns:i,items:[]};const d=r.bind({});d.args={columns:i,items:[],isLoading:!0};const S=r.bind({});S.args={columns:i,items:[...Array(s).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const Te={id:"actions",cell:e=>e.actions,label:""},b=r.bind({});b.args={columns:[...i,Te],items:[...Array(s).keys()].map((e,n)=>({label:`Service #${n}`,price:Math.floor(1+Math.random()*100),actions:a.jsx("div",{className:"flex items-center justify-center",children:a.jsx("div",{children:a.jsx(Ae,{isCompact:!0,variant:Ie.ghost,id:n.toString(),items:[{id:1,target:"_blank",label:"Action 1",urn:"urn:v9:eu:resource:manatestkds-fdsfsd",iamActions:["vrackServices:apiovh:iam/resource/update"]},{id:2,target:"_blank",label:"Action 2",urn:"urn:v9:eu:resource:manate",iamActions:["vrackServices:apiovh:iam/resource/delete"]}]})})})})),isSortable:!0};const f=r.bind({});f.args={items:[...Array(s).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),columns:Ne};const y=r.bind({});y.args={items:[...Array(s).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100),iam:{id:"test",urn:"urn:v9:eu:resource:manatestkds-fdsfsd",tags:{key1:`tag-1-${n}`,key2:`tag-2-${n}`,[n]:"value-test"}}})),columns:Ve};const w=r.bind({});w.args={items:[...Array(s).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),columns:Oe,onColumnVisibilityChange:void 0};const P=r.bind({}),ze=()=>a.jsx(Re,{label:"Add item",icon:Fe.plus});P.args={items:[...Array(s).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100),status:`Status #${n}`,anotherStatus:`AnotherStatus #${n}`})),columns:_e,search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}},topbar:a.jsx(ze,{}),onColumnVisibilityChange:void 0};const m=r.bind({});m.args={columns:i,items:[...Array(s).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),rowSelection:!0,enableRowSelection:e=>e.original.price>50,onRowSelectionChange:()=>{}};m.argTypes={rowSelection:{description:`this control does not exist on datagrid and simulate the use rowSelection Datagrid prop with the attributes rowSelection and setRowSelection which is a state manage by the parent component.
    When true pass "rowSelection={{rowSelection, setRowSelection}}" as an attribute of the datagrid`},enableRowSelection:{description:`takes the current row as param and if return true, the selection is enable. If false it is disabled.
    the function should be of type (row: Row<T>) => boolean.
    On this example, the function is (row) => row.orginal.price > 50
    `},onRowSelectionChange:{description:`callback used by datagrid whenever a change has been made on row selection.
    the function should be of type (rows: Row<T>[]) => void
    `}};const C=r.bind({});C.args={columns:i,items:[...Array(s).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:e=>a.jsx(Me,{children:JSON.stringify(e.original)})};const I=r.bind({});I.args={columns:i,items:[...Array(s).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:(e,n)=>{const R=i.map(c=>({...c,size:n.current[c.id].clientWidth}));return a.jsxs(a.Fragment,{children:[a.jsx("style",{children:`
      .sub-row > td {
        padding: 0 0 0 var(--expander-column-width) !important;
      }
      .sub-row table, .sub-row tr {
        border: none;
      }
      .sub-row table td {
        border-left: none !important;
        border-right: none !important;
      }
      .sub-row table tr:first-child td {
        border-top: none;
      }
      .sub-row table tr:last-child td {
        border-bottom: none;
      }
      .sub-row table tr td:first-child {
        border-left: none;
      }
      .sub-row table tr td:last-child {
        border-right: none;
      }
    `}),a.jsx(v,{columns:R,items:[{label:"sub component label",price:10,status:"",anotherStatus:"",iam:{}},{label:"sub component label #2",price:100,status:"",anotherStatus:"",iam:{}}],totalItems:2,hideHeader:!0,tableLayoutFixed:!0})]})}};const Ge={title:"Manager React Components/Components/Datagrid Cursor",component:v,decorators:[ve]};var N,V,O;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(O=(V=p.parameters)==null?void 0:V.docs)==null?void 0:O.source}}};var _,T,z;u.parameters={...u.parameters,docs:{...(_=u.parameters)==null?void 0:_.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(z=(T=u.parameters)==null?void 0:T.docs)==null?void 0:z.source}}};var E,j,L;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(L=(j=d.parameters)==null?void 0:j.docs)==null?void 0:L.source}}};var W,B,J;S.parameters={...S.parameters,docs:{...(W=S.parameters)==null?void 0:W.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(J=(B=S.parameters)==null?void 0:B.docs)==null?void 0:J.source}}};var K,Y,H;b.parameters={...b.parameters,docs:{...(K=b.parameters)==null?void 0:K.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(H=(Y=b.parameters)==null?void 0:Y.docs)==null?void 0:H.source}}};var U,q,G;f.parameters={...f.parameters,docs:{...(U=f.parameters)==null?void 0:U.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(G=(q=f.parameters)==null?void 0:q.docs)==null?void 0:G.source}}};var Q,X,Z;y.parameters={...y.parameters,docs:{...(Q=y.parameters)==null?void 0:Q.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(Z=(X=y.parameters)==null?void 0:X.docs)==null?void 0:Z.source}}};var ee,ne,ae;w.parameters={...w.parameters,docs:{...(ee=w.parameters)==null?void 0:ee.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(ae=(ne=w.parameters)==null?void 0:ne.docs)==null?void 0:ae.source}}};var te,se,re;P.parameters={...P.parameters,docs:{...(te=P.parameters)==null?void 0:te.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(re=(se=P.parameters)==null?void 0:se.docs)==null?void 0:re.source}}};var oe,ie,le;m.parameters={...m.parameters,docs:{...(oe=m.parameters)==null?void 0:oe.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(le=(ie=m.parameters)==null?void 0:ie.docs)==null?void 0:le.source}}};var ce,me,ge;C.parameters={...C.parameters,docs:{...(ce=C.parameters)==null?void 0:ce.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(ge=(me=C.parameters)==null?void 0:me.docs)==null?void 0:ge.source}}};var he,pe,ue;I.parameters={...I.parameters,docs:{...(he=I.parameters)==null?void 0:he.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const [rowSelection, setRowSelection] = useState({});
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const fetchAllPages = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(pageSize * maxPages - itemsIndex).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  const columnSearchable = useMemo(() => args?.columns?.find(item => Object.prototype.hasOwnProperty.call(item, 'isSearchable')), [columns]);
  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(args.items, !search || search.length === 0 ? filters : [{
        key: columnSearchable.id,
        value: searchInput,
        comparator: FilterComparator.Includes
      }, ...filters]);
      setData(tmp);
    }
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length && data.length < maxPages * pageSize} onFetchNextPage={fetchNextPage} onFetchAllPages={fetchAllPages} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} columnVisibility={args.columnVisibility} onColumnVisibilityChange={args.onColumnVisibilityChange} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    } : {}} getRowCanExpand={args.getRowCanExpand} renderSubComponent={args.renderSubComponent} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} rowSelection={args.rowSelection ? {
      rowSelection,
      setRowSelection,
      enableRowSelection: args.enableRowSelection,
      onToggleAllRowsSelection: args.onToggleAllRowsSelection,
      onRowSelectionChange: args.onRowSelectionChange
    } : undefined} />
    </>;
}`,...(ue=(pe=I.parameters)==null?void 0:pe.docs)==null?void 0:ue.source}}};const Qe=["Basic","Empty","Loading","Sortable","WithActions","Filters","FiltersWithTags","Visibility","Topbar","RowSelection","WithSubComponent","WithDatagridSubComponent"];export{p as Basic,u as Empty,f as Filters,y as FiltersWithTags,d as Loading,m as RowSelection,S as Sortable,P as Topbar,w as Visibility,b as WithActions,I as WithDatagridSubComponent,C as WithSubComponent,Qe as __namedExportsOrder,Ge as default};
