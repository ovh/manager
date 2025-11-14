import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{r}from"./index-Bnop-kX6.js";import{t as te}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as se}from"./ods-react60-0db41gCx.js";import{x as Nn,s as ie}from"./Button-BC-ipw2F-CXZv4wj7.js";import{L as ae,S as re}from"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import{p as oe}from"./Input-DcqcPYne-DrbRSC9d.js";import{U as Pn,_ as le}from"./lib-3BNUHx3P-DQ0dZkTw.js";import{K as ce}from"./index-DZJ2zH-F.js";import{g as P,m as L,e as ge}from"./index-BvE2bIaB.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./iframe-D5tzyF_8.js";import"./QueryClientProvider-YWZt9LhG.js";import"./index-4pTrEEYx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-yMJhEyPY.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";const t=[{id:"person",label:"Person",accessorKey:"person",header:"Person",enableHiding:!0,comparator:P.String,cell:({getValue:n})=>e.jsx("div",{children:n()})},{id:"mostInterestIn",label:"Most interest in",accessorKey:"mostInterestIn",header:"Most interest in",enableHiding:!0,type:P.String,cell:({getValue:n})=>e.jsx("div",{children:n()})},{id:"age",label:"Age",accessorKey:"age",header:"Age",enableHiding:!1,type:P.Numeric,cell:({getValue:n})=>e.jsx("div",{children:n()})}],a=[{id:"fjejfoirejfoierjfoier-id-1",person:"John Doe",mostInterestIn:"	HTML tables",age:25},{id:"zfdfdsdsfdsfds-id-2",person:"Jane Doe",mostInterestIn:"Web accessibility",age:26},{id:"fdfdsds-id-3",person:"Sarah",mostInterestIn:"JavaScript frameworks",age:25},{id:"fdfdsds-id-4",person:"Karen",mostInterestIn:"	Web performance",age:26}],s=n=>{var D;const[$n,Rn]=r.useState([]),[$,Mn]=r.useState(""),Vn={sorting:$n,setSorting:Rn,manualSorting:!1},[R,Dn]=r.useState(!1),[i,v]=r.useState(n.data),M=n.columns,Ln=()=>{const o=Array.from({length:1e4},(l,c)=>({...i[c],id:`person-${i.length+c}`,person:`Most interest in ${i.length+c}`,mostInterestIn:`Most interest in ${i.length+c}`,age:c+1}));v([...i,...o])},[V,En]=r.useState(n.containerHeight),[kn,jn]=r.useState(n.containerHeight),{autoScroll:_n,renderSubComponent:On,subComponentHeight:Bn,maxRowHeight:Jn,isLoading:Un,totalCount:Tn,topbar:Kn}=n,{filters:f,addFilter:zn,removeFilter:Wn}=le(),[qn,Gn]=r.useState({}),[N,Qn]=r.useState({}),Xn=o=>{const l=L(n.data,!o||o.length===0?f:[{key:"person",value:$,comparator:ge.Includes},...f]);v(l)},[Yn,Zn]=r.useState({}),ne=r.useMemo(()=>M.map(o=>({...o,..."sorting"in n&&{isSortable:!0},..."search"in n&&{isSearchable:!0},..."filters"in n&&{isFilterable:!0}})),[M,n]),ee=r.useMemo(()=>i==null?void 0:i.map((o,l)=>({...o,..."subRows"in n&&{subRows:Array.from({length:5},(c,A)=>({id:`sub-${l}-${A}`,person:`Most interest in ${A+(l*2+888888)}`,mostInterestIn:`Most interest in ${A+(l*2+888888)}`,age:A+(l*2+888888)}))}})),[i,n]);return e.jsxs(e.Fragment,{children:["containerHeight"in n&&e.jsx("div",{className:"py-4",children:e.jsx("div",{className:"max-w-[200px]",children:e.jsxs(ae,{children:[e.jsx(re,{children:"Container Height"}),e.jsx(oe,{value:V,onChange:o=>En(Number(o.target.value))}),e.jsx(Nn,{onClick:()=>jn(V),children:"Update"})]})})}),e.jsx(Pn,{columns:ne,data:L(ee,f),..."containerHeight"in n&&{containerHeight:kn},..."manualSorting"in n&&{sorting:{...Vn}},..."onFetchAllPages"in n&&!R&&{hasNextPage:!0,onFetchAllPages:()=>{Dn(!0),Ln()}},..."onFetchNextPage"in n&&!R&&{hasNextPage:!0,onFetchNextPage:()=>v([...i,{id:`person-${i.length+1}`,person:`Person ${i.length+1}`,mostInterestIn:`Most interest in ${i.length+1}`,age:i.length+1}])},..."renderSubComponent"in n&&{renderSubComponent:On},..."subComponentHeight"in n&&{subComponentHeight:Bn},..."maxRowHeight"in n&&{maxRowHeight:Jn},..."isLoading"in n&&{isLoading:Un},..."totalCount"in n&&{totalCount:Tn},..."expandable"in n&&{expandable:{expanded:Yn,setExpanded:Zn}},..."autoScroll"in n&&{autoScroll:_n},..."columnVisibility"in n&&{columnVisibility:{columnVisibility:qn,setColumnVisibility:Gn}},..."topbar"in n&&{topbar:Kn},..."filters"in n&&{filters:{filters:f,add:zn,remove:Wn}},..."search"in n&&{search:{searchInput:$,setSearchInput:Mn,onSearch:Xn}},..."rowSelection"in n&&{rowSelection:{rowSelection:N,setRowSelection:Qn}}}),((D=Object.keys(N))==null?void 0:D.length)>0&&e.jsxs("div",{className:"p-4",children:[e.jsx("h3",{children:"Row Selection"}),e.jsx("div",{className:"bg-gray-100 p-2 rounded-md",children:JSON.stringify(N)})]})]})},g=s.bind({});g.args={columns:t,data:a};const m=s.bind({});m.args={columns:t,data:a,manualSorting:!1,sorting:{sorting:[],setSorting:()=>{},manualSorting:!1}};const d=s.bind({});d.args={columns:t,data:[],isLoading:!0};const u=s.bind({});u.args={columns:t,data:[...a],hasNextPage:!0,onFetchNextPage:()=>{}};const h=s.bind({});h.args={columns:t,data:[...a],manualSorting:!1,hasNextPage:!0,onFetchAllPages:()=>{},onFetchNextPage:()=>{}};const p=s.bind({});p.args={columns:t,data:[...a],manualSorting:!1,containerHeight:"260px"};const S=s.bind({});S.args={columns:t,data:[...a],autoScroll:!1,renderSubComponent:n=>e.jsxs(e.Fragment,{children:[e.jsx("div",{children:n.original.person}),e.jsx("div",{children:n.original.mostInterestIn}),e.jsx("div",{children:n.original.age})]}),subComponentHeight:80};const x=s.bind({});x.args={columns:t,data:[...a],expandable:{expanded:{},setExpanded:()=>{}},autoScroll:!1,subComponentHeight:80,subRows:!0};const b=s.bind({});b.args={columns:t,data:[...a],manualSorting:!1,columnVisibility:{columnVisibility:{person:!0,mostInterestIn:!0,age:!0},setColumnVisibility:()=>{}}};const F=s.bind({});F.args={columns:t,data:[...a],filters:{filters:[],add:()=>{},remove:()=>{}}};const I=s.bind({});I.args={columns:t,data:[...a],search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}}};const y=s.bind({});y.args={columns:t,data:[...a],rowSelection:{rowSelection:[],setRowSelection:()=>{},onRowSelectionChange:()=>{}}};const H=s.bind({});H.args={columns:t,data:[...a],topbar:e.jsx("div",{children:e.jsxs(Nn,{size:ie.sm,children:[e.jsx(te,{name:se.plus}),"Add New"]})}),filters:{filters:[],add:()=>{},remove:()=>{}},search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}},rowSelection:{rowSelection:[],setRowSelection:()=>{},onRowSelectionChange:()=>{}},columnVisibility:{columnVisibility:{person:!0,mostInterestIn:!0,age:!0},setColumnVisibility:()=>{}}};const C=s.bind({});C.args={columns:t,data:[...a],totalCount:4};const w=s.bind({});w.args={columns:t,data:[...a],hasNextPage:!0,onFetchAllPages:()=>{},onFetchNextPage:()=>{},totalCount:4};const ct={title:"Manager UI Kit/Components/Datagrid New",component:Pn,tags:["autodocs"],decorators:[ce],parameters:{docs:{description:{component:'The `Datagrid` component provides a powerful data table with built-in pagination controls. The footer actions section includes "Load More" and "Load All" buttons for progressive data loading.'}},preserveArgs:!1},args:{},argTypes:{hasNextPage:{description:"Controls whether pagination buttons are shown",control:"boolean"},isLoading:{description:"Shows loading state on pagination buttons",control:"boolean"}}};var E,k,j;g.parameters={...g.parameters,docs:{...(E=g.parameters)==null?void 0:E.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(j=(k=g.parameters)==null?void 0:k.docs)==null?void 0:j.source}}};var _,O,B;m.parameters={...m.parameters,docs:{...(_=m.parameters)==null?void 0:_.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(B=(O=m.parameters)==null?void 0:O.docs)==null?void 0:B.source}}};var J,U,T;d.parameters={...d.parameters,docs:{...(J=d.parameters)==null?void 0:J.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(T=(U=d.parameters)==null?void 0:U.docs)==null?void 0:T.source}}};var K,z,W;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(W=(z=u.parameters)==null?void 0:z.docs)==null?void 0:W.source}}};var q,G,Q;h.parameters={...h.parameters,docs:{...(q=h.parameters)==null?void 0:q.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(Q=(G=h.parameters)==null?void 0:G.docs)==null?void 0:Q.source}}};var X,Y,Z;p.parameters={...p.parameters,docs:{...(X=p.parameters)==null?void 0:X.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(Z=(Y=p.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};var nn,en,tn;S.parameters={...S.parameters,docs:{...(nn=S.parameters)==null?void 0:nn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(tn=(en=S.parameters)==null?void 0:en.docs)==null?void 0:tn.source}}};var sn,an,rn;x.parameters={...x.parameters,docs:{...(sn=x.parameters)==null?void 0:sn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(rn=(an=x.parameters)==null?void 0:an.docs)==null?void 0:rn.source}}};var on,ln,cn;b.parameters={...b.parameters,docs:{...(on=b.parameters)==null?void 0:on.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(cn=(ln=b.parameters)==null?void 0:ln.docs)==null?void 0:cn.source}}};var gn,mn,dn;F.parameters={...F.parameters,docs:{...(gn=F.parameters)==null?void 0:gn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(dn=(mn=F.parameters)==null?void 0:mn.docs)==null?void 0:dn.source}}};var un,hn,pn;I.parameters={...I.parameters,docs:{...(un=I.parameters)==null?void 0:un.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(pn=(hn=I.parameters)==null?void 0:hn.docs)==null?void 0:pn.source}}};var Sn,xn,bn;y.parameters={...y.parameters,docs:{...(Sn=y.parameters)==null?void 0:Sn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(bn=(xn=y.parameters)==null?void 0:xn.docs)==null?void 0:bn.source}}};var Fn,In,yn;H.parameters={...H.parameters,docs:{...(Fn=H.parameters)==null?void 0:Fn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(yn=(In=H.parameters)==null?void 0:In.docs)==null?void 0:yn.source}}};var Hn,Cn,wn;C.parameters={...C.parameters,docs:{...(Hn=C.parameters)==null?void 0:Hn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(wn=(Cn=C.parameters)==null?void 0:Cn.docs)==null?void 0:wn.source}}};var fn,An,vn;w.parameters={...w.parameters,docs:{...(fn=w.parameters)==null?void 0:fn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
        id: \`sub-\${indexItems}-\${index}\`,
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
        id: \`person-\${items.length + 1}\`,
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
      {Object.keys(rowSelection)?.length > 0 && <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>}
    </>;
}`,...(vn=(An=w.parameters)==null?void 0:An.docs)==null?void 0:vn.source}}};const gt=["Default","Sorting","Loading","LoadMore","LoadAllAndLoading","ContainerHeight","SubComponent","Expandable","VisibilityColumns","Filtering","Search","RowSelection","Topbar","TotalCount","FullFooter"];export{p as ContainerHeight,g as Default,x as Expandable,F as Filtering,w as FullFooter,h as LoadAllAndLoading,u as LoadMore,d as Loading,y as RowSelection,I as Search,m as Sorting,S as SubComponent,H as Topbar,C as TotalCount,b as VisibilityColumns,gt as __namedExportsOrder,ct as default};
