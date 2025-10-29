import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r}from"./index-Bnop-kX6.js";import{t as ee}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as te}from"./ods-react60-0db41gCx.js";import{x as fn,s as se}from"./Button-BC-ipw2F-4e7GV2_-.js";import{L as ie,S as ae}from"./FormFieldLabel-DerGjSSG-BDyW1aTt.js";import{p as re}from"./Input-DcqcPYne-BLK_63J0.js";import{L as vn,g as oe}from"./lib-CWaID5dp-BsSnuVqJ.js";import{K as le}from"./index-DrHmTBeC.js";import{a9 as P,ar as $,a3 as ce}from"./index-DJBc9Vat.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./ods-react65-wKxTpDjY.js";import"./Text-CcNd6qQr-FOgQIkhx.js";import"./ods-react61-4lD3hp9p.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./iframe-DvogHFNi.js";import"./index-4pTrEEYx.js";const t=[{id:"person",label:"Person",accessorKey:"person",header:"Person",enableHiding:!0,comparator:P.String,cell:({getValue:n})=>e.jsx("div",{children:n()})},{id:"mostInterestIn",label:"Most interest in",accessorKey:"mostInterestIn",header:"Most interest in",enableHiding:!0,type:P.String,cell:({getValue:n})=>e.jsx("div",{children:n()})},{id:"age",label:"Age",accessorKey:"age",header:"Age",enableHiding:!1,type:P.Numeric,cell:({getValue:n})=>e.jsx("div",{children:n()})}],i=[{person:"John Doe",mostInterestIn:"	HTML tables",age:25},{person:"Jane Doe",mostInterestIn:"Web accessibility",age:26},{person:"Sarah",mostInterestIn:"JavaScript frameworks",age:25},{person:"Karen",mostInterestIn:"	Web performance",age:26}],s=n=>{const[Pn,Rn]=r.useState([]),[R,Nn]=r.useState(""),Mn={sorting:Pn,setSorting:Rn,manualSorting:!1},[N,Vn]=r.useState(!1),[a,f]=r.useState(n.data),M=n.columns,$n=()=>{const o=Array.from({length:1e4},(l,c)=>({...a[c],person:`Most interest in ${a.length+c}`,mostInterestIn:`Most interest in ${a.length+c}`,age:c+1}));f([...a,...o])},[V,Ln]=r.useState(n.containerHeight),[Dn,En]=r.useState(n.containerHeight),{autoScroll:kn,renderSubComponent:_n,subComponentHeight:Bn,maxRowHeight:jn,isLoading:Un,totalCount:Tn,topbar:Kn}=n,{filters:w,addFilter:Jn,removeFilter:Wn}=oe(),[zn,On]=r.useState({}),[qn,Gn]=r.useState({}),Qn=o=>{const l=$(n.data,!o||o.length===0?w:[{key:"person",value:R,comparator:ce.Includes},...w]);f(l)},[Xn,Yn]=r.useState({}),Zn=r.useMemo(()=>M.map(o=>({...o,..."sorting"in n&&{isSortable:!0},..."search"in n&&{isSearchable:!0},..."filters"in n&&{isFilterable:!0}})),[M,n]),ne=r.useMemo(()=>a==null?void 0:a.map((o,l)=>({...o,..."subRows"in n&&{subRows:Array.from({length:5},(c,v)=>({person:`Most interest in ${v+(l*2+888888)}`,mostInterestIn:`Most interest in ${v+(l*2+888888)}`,age:v+(l*2+888888)}))}})),[a,n]);return e.jsxs(e.Fragment,{children:["containerHeight"in n&&e.jsx("div",{className:"py-4",children:e.jsx("div",{className:"max-w-[200px]",children:e.jsxs(ie,{children:[e.jsx(ae,{children:"Container Height"}),e.jsx(re,{value:V,onChange:o=>Ln(Number(o.target.value))}),e.jsx(fn,{onClick:()=>En(V),children:"Update"})]})})}),e.jsx(vn,{columns:Zn,data:$(ne,w),..."containerHeight"in n&&{containerHeight:Dn},..."manualSorting"in n&&{sorting:{...Mn}},..."onFetchAllPages"in n&&!N&&{hasNextPage:!0,onFetchAllPages:()=>{Vn(!0),$n()}},..."onFetchNextPage"in n&&!N&&{hasNextPage:!0,onFetchNextPage:()=>f([...a,{person:`Person ${a.length+1}`,mostInterestIn:`Most interest in ${a.length+1}`,age:a.length+1}])},..."renderSubComponent"in n&&{renderSubComponent:_n},..."subComponentHeight"in n&&{subComponentHeight:Bn},..."maxRowHeight"in n&&{maxRowHeight:jn},..."isLoading"in n&&{isLoading:Un},..."totalCount"in n&&{totalCount:Tn},..."expandable"in n&&{expandable:{expanded:Xn,setExpanded:Yn}},..."autoScroll"in n&&{autoScroll:kn},..."columnVisibility"in n&&{columnVisibility:{columnVisibility:zn,setColumnVisibility:On}},..."topbar"in n&&{topbar:Kn},..."filters"in n&&{filters:{filters:w,add:Jn,remove:Wn}},..."search"in n&&{search:{searchInput:R,setSearchInput:Nn,onSearch:Qn}},..."rowSelection"in n&&{rowSelection:{rowSelection:qn,setRowSelection:Gn}}})]})},g=s.bind({});g.args={columns:t,data:i};const m=s.bind({});m.args={columns:t,data:i,manualSorting:!1,sorting:{sorting:[],setSorting:()=>{},manualSorting:!1}};const u=s.bind({});u.args={columns:t,data:[],isLoading:!0};const d=s.bind({});d.args={columns:t,data:[...i],hasNextPage:!0,onFetchNextPage:()=>{}};const h=s.bind({});h.args={columns:t,data:[...i],manualSorting:!1,hasNextPage:!0,onFetchAllPages:()=>{},onFetchNextPage:()=>{}};const S=s.bind({});S.args={columns:t,data:[...i],manualSorting:!1,containerHeight:"260px"};const p=s.bind({});p.args={columns:t,data:[...i],autoScroll:!1,renderSubComponent:n=>e.jsxs(e.Fragment,{children:[e.jsx("div",{children:n.original.person}),e.jsx("div",{children:n.original.mostInterestIn}),e.jsx("div",{children:n.original.age})]}),subComponentHeight:80};const x=s.bind({});x.args={columns:t,data:[...i],expandable:{expanded:{},setExpanded:()=>{}},autoScroll:!1,subComponentHeight:80,subRows:!0};const b=s.bind({});b.args={columns:t,data:[...i],manualSorting:!1,columnVisibility:{columnVisibility:{person:!0,mostInterestIn:!0,age:!0},setColumnVisibility:()=>{}}};const F=s.bind({});F.args={columns:t,data:[...i],filters:{filters:[],add:()=>{},remove:()=>{}}};const I=s.bind({});I.args={columns:t,data:[...i],search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}}};const H=s.bind({});H.args={columns:t,data:[...i],rowSelection:{rowSelection:[],setRowSelection:()=>{},onRowSelectionChange:()=>{}}};const C=s.bind({});C.args={columns:t,data:[...i],topbar:e.jsx("div",{children:e.jsxs(fn,{size:se.sm,children:[e.jsx(ee,{name:te.plus}),"Add New"]})}),filters:{filters:[],add:()=>{},remove:()=>{}},search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}},rowSelection:{rowSelection:[],setRowSelection:()=>{},onRowSelectionChange:()=>{}},columnVisibility:{columnVisibility:{person:!0,mostInterestIn:!0,age:!0},setColumnVisibility:()=>{}}};const y=s.bind({});y.args={columns:t,data:[...i],totalCount:4};const A=s.bind({});A.args={columns:t,data:[...i],hasNextPage:!0,onFetchAllPages:()=>{},onFetchNextPage:()=>{},totalCount:4};const Re={title:"Manager UI Kit/Components/Datagrid New",component:vn,tags:["autodocs"],decorators:[le],parameters:{docs:{description:{component:'The `Datagrid` component provides a powerful data table with built-in pagination controls. The footer actions section includes "Load More" and "Load All" buttons for progressive data loading.'}},preserveArgs:!1},args:{},argTypes:{hasNextPage:{description:"Controls whether pagination buttons are shown",control:"boolean"},isLoading:{description:"Shows loading state on pagination buttons",control:"boolean"}}};var L,D,E;g.parameters={...g.parameters,docs:{...(L=g.parameters)==null?void 0:L.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(E=(D=g.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var k,_,B;m.parameters={...m.parameters,docs:{...(k=m.parameters)==null?void 0:k.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(B=(_=m.parameters)==null?void 0:_.docs)==null?void 0:B.source}}};var j,U,T;u.parameters={...u.parameters,docs:{...(j=u.parameters)==null?void 0:j.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(T=(U=u.parameters)==null?void 0:U.docs)==null?void 0:T.source}}};var K,J,W;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(W=(J=d.parameters)==null?void 0:J.docs)==null?void 0:W.source}}};var z,O,q;h.parameters={...h.parameters,docs:{...(z=h.parameters)==null?void 0:z.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(q=(O=h.parameters)==null?void 0:O.docs)==null?void 0:q.source}}};var G,Q,X;S.parameters={...S.parameters,docs:{...(G=S.parameters)==null?void 0:G.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(X=(Q=S.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,nn;p.parameters={...p.parameters,docs:{...(Y=p.parameters)==null?void 0:Y.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(nn=(Z=p.parameters)==null?void 0:Z.docs)==null?void 0:nn.source}}};var en,tn,sn;x.parameters={...x.parameters,docs:{...(en=x.parameters)==null?void 0:en.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(sn=(tn=x.parameters)==null?void 0:tn.docs)==null?void 0:sn.source}}};var an,rn,on;b.parameters={...b.parameters,docs:{...(an=b.parameters)==null?void 0:an.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(on=(rn=b.parameters)==null?void 0:rn.docs)==null?void 0:on.source}}};var ln,cn,gn;F.parameters={...F.parameters,docs:{...(ln=F.parameters)==null?void 0:ln.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(gn=(cn=F.parameters)==null?void 0:cn.docs)==null?void 0:gn.source}}};var mn,un,dn;I.parameters={...I.parameters,docs:{...(mn=I.parameters)==null?void 0:mn.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(dn=(un=I.parameters)==null?void 0:un.docs)==null?void 0:dn.source}}};var hn,Sn,pn;H.parameters={...H.parameters,docs:{...(hn=H.parameters)==null?void 0:hn.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(pn=(Sn=H.parameters)==null?void 0:Sn.docs)==null?void 0:pn.source}}};var xn,bn,Fn;C.parameters={...C.parameters,docs:{...(xn=C.parameters)==null?void 0:xn.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(Fn=(bn=C.parameters)==null?void 0:bn.docs)==null?void 0:Fn.source}}};var In,Hn,Cn;y.parameters={...y.parameters,docs:{...(In=y.parameters)==null?void 0:In.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(Cn=(Hn=y.parameters)==null?void 0:Hn.docs)==null?void 0:Cn.source}}};var yn,An,wn;A.parameters={...A.parameters,docs:{...(yn=A.parameters)==null?void 0:yn.docs,source:{originalSource:`(args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({
      length: 10000
    }, (_, index) => ({
      ...items[index],
      person: \`Most interest in \${items.length + index}\`,
      mostInterestIn: \`Most interest in \${items.length + index}\`,
      age: index + 1
    }));
    setItems([...items, ...newData]);
  };
  const [containerHeightState, setContainerHeightState] = useState(args.containerHeight);
  const [containerHeightStyle, setContainerHeightStyle] = useState(args.containerHeight);
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    topbar
  } = args;
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(args.data, !search || search.length === 0 ? filters : [{
      key: 'person',
      value: searchInput,
      comparator: FilterComparator.Includes
    }, ...filters]);
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(() => cols.map(col => ({
    ...col,
    ...('sorting' in args && {
      isSortable: true
    }),
    ...('search' in args && {
      isSearchable: true
    }),
    ...('filters' in args && {
      isFilterable: true
    })
  })), [cols, args]);
  const itemsArgs = useMemo(() => items?.map((col, indexItems) => ({
    ...col,
    ...('subRows' in args && {
      subRows: Array.from({
        length: 5
      }, (_, index) => ({
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      {'containerHeight' in args && <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input value={containerHeightState} onChange={e => setContainerHeightState(Number(e.target.value))} />
              <Button onClick={() => setContainerHeightStyle(containerHeightState)}>
                Update
              </Button>
            </FormField>
          </div>
        </div>}
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'containerHeight' in args && {
      containerHeight: containerHeightStyle
    }} {...'manualSorting' in args && {
      sorting: {
        ...sortAttrs
      }
    }} {...'onFetchAllPages' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchAllPages: () => {
        setIsFetchAll(true);
        fetchAllPages();
      }
    }} {...'onFetchNextPage' in args && !isFetchAll && {
      hasNextPage: true,
      onFetchNextPage: () => setItems([...items, {
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'renderSubComponent' in args && {
      renderSubComponent
    }} {...'subComponentHeight' in args && {
      subComponentHeight
    }} {...'maxRowHeight' in args && {
      maxRowHeight
    }} {...'isLoading' in args && {
      isLoading
    }} {...'totalCount' in args && {
      totalCount
    }} {...'expandable' in args && {
      expandable: {
        expanded,
        setExpanded
      }
    }} {...'autoScroll' in args && {
      autoScroll
    }} {...'columnVisibility' in args && {
      columnVisibility: {
        columnVisibility,
        setColumnVisibility
      }
    }} {...'topbar' in args && {
      topbar
    }} {...'filters' in args && {
      filters: {
        filters,
        add: addFilter,
        remove: removeFilter
      }
    }} {...'search' in args && {
      search: {
        searchInput,
        setSearchInput,
        onSearch
      }
    }} {...'rowSelection' in args && {
      rowSelection: {
        rowSelection,
        setRowSelection
      }
    }} />
    </>;
}`,...(wn=(An=A.parameters)==null?void 0:An.docs)==null?void 0:wn.source}}};const Ne=["Default","Sorting","Loading","LoadMore","LoadAllAndLoading","ContainerHeight","SubComponent","Expandable","VisibilityColumns","Filtering","Search","RowSelection","Topbar","TotalCount","FullFooter"];export{S as ContainerHeight,g as Default,x as Expandable,F as Filtering,A as FullFooter,h as LoadAllAndLoading,d as LoadMore,u as Loading,H as RowSelection,I as Search,m as Sorting,p as SubComponent,C as Topbar,y as TotalCount,b as VisibilityColumns,Ne as __namedExportsOrder,Re as default};
