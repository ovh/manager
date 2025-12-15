import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r}from"./index-Bnop-kX6.js";import{t as de}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as me}from"./ods-react60-0db41gCx.js";import{x as he,s as ue}from"./Button-BC-ipw2F-4e7GV2_-.js";import{r as v,t as D}from"./ods-react74-CqqYT8k0.js";import{a as jn,U as Se}from"./lib-sJyaz0Xv-BL1_0Bz9.js";import{K as pe}from"./index-DeUn1rv3.js";import{a7 as V,aq as _,a1 as xe}from"./index-ChsYPcXR.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./ods-react65-wKxTpDjY.js";import"./iframe-BRebac83.js";import"./QueryClientProvider-C1FTVqK-.js";import"./index-4pTrEEYx.js";const t=[{id:"person",label:"Person",accessorKey:"person",header:"Person",enableHiding:!0,comparator:V.String,cell:({getValue:n})=>e.jsx("div",{children:n()})},{id:"mostInterestIn",label:"Most interest in",accessorKey:"mostInterestIn",header:"Most interest in",enableHiding:!0,type:V.String,cell:({getValue:n})=>e.jsx("div",{children:n()})},{id:"age",label:"Age",accessorKey:"age",header:"Age",enableHiding:!1,type:V.Numeric,cell:({getValue:n})=>e.jsx("div",{children:n()})}],i=[{id:"fjejfoirejfoierjfoier-id-1",person:"John Doe",mostInterestIn:"	HTML tables",age:25},{id:"zfdfdsdsfdsfds-id-2",person:"Jane Doe",mostInterestIn:"Web accessibility",age:26},{id:"fdfdsds-id-3",person:"Sarah",mostInterestIn:"JavaScript frameworks",age:25},{id:"fdfdsds-id-4",person:"Karen",mostInterestIn:"	Web performance",age:26}],s=n=>{var j;const[P,_n]=r.useState([]),[L,kn]=r.useState(""),On={sorting:P,setSorting:_n,manualSorting:!1},[z,Jn]=r.useState(!1),[a,N]=r.useState(n.data),E=n.columns,Tn=()=>{const o=Array.from({length:1e4},(l,c)=>({...a[c],id:`person-${a.length+c}`,person:`Most interest in ${a.length+c}`,mostInterestIn:`Most interest in ${a.length+c}`,age:c+1}));N([...a,...o])};r.useState(n.containerHeight);const[Kn,be]=r.useState(n.containerHeight),{autoScroll:Un,renderSubComponent:Wn,subComponentHeight:qn,maxRowHeight:Bn,isLoading:Gn,size:Qn,variant:Xn,totalCount:Yn,topbar:Zn,hideHeader:ne}=n,{filters:$,addFilter:ee,removeFilter:te}=Se(),[se,ie]=r.useState({}),[M,ae]=r.useState({}),re=o=>{const l=_(n.data,!o||o.length===0?$:[{key:"person",value:L,comparator:xe.Includes},...$]);N(l)},[oe,le]=r.useState({}),ce=r.useMemo(()=>E.map(o=>({...o,..."sorting"in n&&{isSortable:!0},..."search"in n&&{isSearchable:!0},..."filters"in n&&{isFilterable:!0}})),[E,n]),ge=r.useMemo(()=>a==null?void 0:a.map((o,l)=>({...o,..."subRows"in n&&{subRows:Array.from({length:5},(c,R)=>({id:`sub-${l}-${R}`,person:`Most interest in ${R+(l*2+888888)}`,mostInterestIn:`Most interest in ${R+(l*2+888888)}`,age:R+(l*2+888888)}))}})),[a,n]);return e.jsxs(e.Fragment,{children:[e.jsx(jn,{columns:ce,data:_(ge,$),..."size"in n&&{size:Qn},..."variant"in n&&{variant:Xn},..."containerHeight"in n&&{containerHeight:Kn},..."manualSorting"in n&&{sorting:{...On}},..."onFetchAllPages"in n&&!z&&{hasNextPage:!0,onFetchAllPages:()=>{Jn(!0),Tn()}},..."onFetchNextPage"in n&&!z&&{hasNextPage:!0,onFetchNextPage:()=>N([...a,{id:`person-${a.length+1}`,person:`Person ${a.length+1}`,mostInterestIn:`Most interest in ${a.length+1}`,age:a.length+1}])},..."hideHeader"in n&&{hideHeader:ne},..."renderSubComponent"in n&&{renderSubComponent:Wn},..."subComponentHeight"in n&&{subComponentHeight:qn},..."maxRowHeight"in n&&{maxRowHeight:Bn},..."isLoading"in n&&{isLoading:Gn},..."totalCount"in n&&{totalCount:Yn},..."expandable"in n&&{expandable:{expanded:oe,setExpanded:le}},..."autoScroll"in n&&{autoScroll:Un},..."columnVisibility"in n&&{columnVisibility:{columnVisibility:se,setColumnVisibility:ie}},..."topbar"in n&&{topbar:Zn},..."filters"in n&&{filters:{filters:$,add:ee,remove:te}},..."search"in n&&{search:{searchInput:L,setSearchInput:kn,onSearch:re}},..."rowSelection"in n&&{rowSelection:{rowSelection:M,setRowSelection:ae}}}),((j=Object.keys(M))==null?void 0:j.length)>0&&e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{children:"Row Selection"}),e.jsx("div",{className:"bg-gray-100 p-2 rounded-md",children:JSON.stringify(M)})]})]})},g=s.bind({});g.args={columns:t,data:i};const d=s.bind({});d.args={columns:t,data:i,size:v.sm};const m=s.bind({});m.args={columns:t,data:i,variant:D.striped};const h=s.bind({});h.args={columns:t,data:i,manualSorting:!1,sorting:{sorting:[],setSorting:()=>{},manualSorting:!1}};const u=s.bind({});u.args={columns:t,data:[],isLoading:!0};const S=s.bind({});S.args={columns:t,data:[...i],hasNextPage:!0,onFetchNextPage:()=>{}};const p=s.bind({});p.args={columns:t,data:[...i],manualSorting:!1,hasNextPage:!0,onFetchAllPages:()=>{},onFetchNextPage:()=>{}};const x=s.bind({});x.args={columns:t,data:[...i],autoScroll:!1,renderSubComponent:n=>e.jsxs(e.Fragment,{children:[e.jsx("div",{children:n.original.person}),e.jsx("div",{children:n.original.mostInterestIn}),e.jsx("div",{children:n.original.age})]}),subComponentHeight:80,size:v.md};const b=s.bind({});b.args={columns:t,data:[...i],expandable:{expanded:{},setExpanded:()=>{}},autoScroll:!1,subComponentHeight:80,subRows:!0};const I=s.bind({});I.args={columns:t,data:[...i],manualSorting:!1,columnVisibility:{columnVisibility:{person:!0,mostInterestIn:!0,age:!0},setColumnVisibility:()=>{}}};const y=s.bind({});y.args={columns:t,data:[...i],filters:{filters:[],add:()=>{},remove:()=>{}}};const F=s.bind({});F.args={columns:t,data:[...i],search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}}};const H=s.bind({});H.args={columns:t,data:[...i],rowSelection:{rowSelection:[],setRowSelection:()=>{},onRowSelectionChange:()=>{},enableRowSelection:n=>{var P;return((P=n==null?void 0:n.original)==null?void 0:P.age)===26}}};const w=s.bind({});w.args={columns:t,data:[...i],hideHeader:!0};const A=s.bind({});A.args={columns:t,data:[...i],topbar:e.jsx("div",{children:e.jsxs(he,{size:ue.sm,children:[e.jsx(de,{name:me.plus}),"Add New"]})}),filters:{filters:[],add:()=>{},remove:()=>{}},search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}},rowSelection:{rowSelection:[],setRowSelection:()=>{},onRowSelectionChange:()=>{}},columnVisibility:{columnVisibility:{person:!0,mostInterestIn:!0,age:!0},setColumnVisibility:()=>{}}};const f=s.bind({});f.args={columns:t,data:[...i],totalCount:4};const C=s.bind({});C.args={columns:t,data:[...i],hasNextPage:!0,onFetchAllPages:()=>{},onFetchNextPage:()=>{},totalCount:4};const Le={title:"Manager UI Kit/Components/Datagrid",component:jn,tags:["autodocs"],decorators:[pe],parameters:{docs:{description:{component:'The `Datagrid` component provides a powerful data table with built-in pagination controls. The footer actions section includes "Load More" and "Load All" buttons for progressive data loading.'}},preserveArgs:!1},args:{containerHeight:250},argTypes:{size:{description:"Controls the table row size",control:"select",options:[v.sm,v.md,v.lg]},variant:{description:"Controls the table variant style",control:"select",options:[D.default,D.striped]},hasNextPage:{description:"Controls whether pagination buttons are shown",control:"boolean"},isLoading:{description:"Shows loading state on pagination buttons",control:"boolean"}}};var k,O,J;g.parameters={...g.parameters,docs:{...(k=g.parameters)==null?void 0:k.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(J=(O=g.parameters)==null?void 0:O.docs)==null?void 0:J.source}}};var T,K,U;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(U=(K=d.parameters)==null?void 0:K.docs)==null?void 0:U.source}}};var W,q,B;m.parameters={...m.parameters,docs:{...(W=m.parameters)==null?void 0:W.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(B=(q=m.parameters)==null?void 0:q.docs)==null?void 0:B.source}}};var G,Q,X;h.parameters={...h.parameters,docs:{...(G=h.parameters)==null?void 0:G.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(X=(Q=h.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,nn;u.parameters={...u.parameters,docs:{...(Y=u.parameters)==null?void 0:Y.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(nn=(Z=u.parameters)==null?void 0:Z.docs)==null?void 0:nn.source}}};var en,tn,sn;S.parameters={...S.parameters,docs:{...(en=S.parameters)==null?void 0:en.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(sn=(tn=S.parameters)==null?void 0:tn.docs)==null?void 0:sn.source}}};var an,rn,on;p.parameters={...p.parameters,docs:{...(an=p.parameters)==null?void 0:an.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(on=(rn=p.parameters)==null?void 0:rn.docs)==null?void 0:on.source}}};var ln,cn,gn;x.parameters={...x.parameters,docs:{...(ln=x.parameters)==null?void 0:ln.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(gn=(cn=x.parameters)==null?void 0:cn.docs)==null?void 0:gn.source}}};var dn,mn,hn;b.parameters={...b.parameters,docs:{...(dn=b.parameters)==null?void 0:dn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(hn=(mn=b.parameters)==null?void 0:mn.docs)==null?void 0:hn.source}}};var un,Sn,pn;I.parameters={...I.parameters,docs:{...(un=I.parameters)==null?void 0:un.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(pn=(Sn=I.parameters)==null?void 0:Sn.docs)==null?void 0:pn.source}}};var xn,bn,In;y.parameters={...y.parameters,docs:{...(xn=y.parameters)==null?void 0:xn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(In=(bn=y.parameters)==null?void 0:bn.docs)==null?void 0:In.source}}};var yn,Fn,Hn;F.parameters={...F.parameters,docs:{...(yn=F.parameters)==null?void 0:yn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(Hn=(Fn=F.parameters)==null?void 0:Fn.docs)==null?void 0:Hn.source}}};var wn,An,fn;H.parameters={...H.parameters,docs:{...(wn=H.parameters)==null?void 0:wn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(fn=(An=H.parameters)==null?void 0:An.docs)==null?void 0:fn.source}}};var Cn,vn,Pn;w.parameters={...w.parameters,docs:{...(Cn=w.parameters)==null?void 0:Cn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(Pn=(vn=w.parameters)==null?void 0:vn.docs)==null?void 0:Pn.source}}};var $n,Rn,Nn;A.parameters={...A.parameters,docs:{...($n=A.parameters)==null?void 0:$n.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(Nn=(Rn=A.parameters)==null?void 0:Rn.docs)==null?void 0:Nn.source}}};var Mn,Vn,Dn;f.parameters={...f.parameters,docs:{...(Mn=f.parameters)==null?void 0:Mn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(Dn=(Vn=f.parameters)==null?void 0:Vn.docs)==null?void 0:Dn.source}}};var Ln,zn,En;C.parameters={...C.parameters,docs:{...(Ln=C.parameters)==null?void 0:Ln.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
      id: \`person-\${items.length + index}\`,
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
    size,
    variant,
    totalCount,
    topbar,
    hideHeader
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
        id: \`sub-\${indexItems}-\${index}\`,
        person: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        mostInterestIn: \`Most interest in \${index + (indexItems * 2 + 888888)}\`,
        age: index + (indexItems * 2 + 888888)
      }))
    })
  })), [items, args]);
  return <>
      <Datagrid columns={colsArgs} data={applyFilters(itemsArgs, filters)} {...'size' in args && {
      size
    }} {...'variant' in args && {
      variant
    }} {...'containerHeight' in args && {
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
        id: \`person-\${items.length + 1}\`,
        person: \`Person \${items.length + 1}\`,
        mostInterestIn: \`Most interest in \${items.length + 1}\`,
        age: items.length + 1
      }])
    }} {...'hideHeader' in args && {
      hideHeader
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(En=(zn=C.parameters)==null?void 0:zn.docs)==null?void 0:En.source}}};const ze=["Default","Size","Variant","Sorting","Loading","LoadMore","LoadAllAndLoading","SubComponent","Expandable","VisibilityColumns","Filtering","Search","RowSelection","HideHeader","Topbar","TotalCount","FullFooter"];export{g as Default,b as Expandable,y as Filtering,C as FullFooter,w as HideHeader,p as LoadAllAndLoading,S as LoadMore,u as Loading,H as RowSelection,F as Search,d as Size,h as Sorting,x as SubComponent,A as Topbar,f as TotalCount,m as Variant,I as VisibilityColumns,ze as __namedExportsOrder,Le as default};
