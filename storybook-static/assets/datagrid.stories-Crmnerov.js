import{j as s}from"./jsx-runtime-BRNY0I4F.js";import{r as a}from"./index-Bnop-kX6.js";import{a as pe}from"./Icon-xxQ9IRzi-ORI6lMWl.js";import{l as Se}from"./Link-TMoA1i18-DiBAU0SL.js";import{r as P,l as E,R as xe,s as be}from"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import{f as Jn,m as Ie}from"./lib-7WI39Bnb-C2vw7fTL.js";import{K as ye}from"./index-DZGBJQ4L.js";import{g as M,m as O,e as fe}from"./index-DnqQo6oJ.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./index-4pTrEEYx.js";import"./iframe-CaW5sJsF.js";import"./QueryClientProvider-BPX08D6Z.js";import"./Divider-wQyo85oE-5vlIiwia.js";const e=[{id:"person",label:"Person",accessorKey:"person",header:"Person",enableHiding:!0,comparator:M.String,cell:({getValue:n})=>s.jsx("div",{children:n()})},{id:"mostInterestIn",label:"Most interest in",accessorKey:"mostInterestIn",header:"Most interest in",enableHiding:!0,type:M.String,cell:({getValue:n})=>s.jsx("div",{children:n()})},{id:"age",label:"Age",accessorKey:"age",header:"Age",enableHiding:!1,type:M.Numeric,cell:({getValue:n})=>s.jsx("div",{children:n()})}],i=[{id:"fjejfoirejfoierjfoier-id-1",person:"John Doe",mostInterestIn:"	HTML tables",age:25},{id:"zfdfdsdsfdsfds-id-2",person:"Jane Doe",mostInterestIn:"Web accessibility",age:26},{id:"fdfdsds-id-3",person:"Sarah",mostInterestIn:"JavaScript frameworks",age:25},{id:"fdfdsds-id-4",person:"Karen",mostInterestIn:"	Web performance",age:26}],t=n=>{var _;const[R,Tn]=a.useState([]),[L,Kn]=a.useState(""),Bn={sorting:R,setSorting:Tn,manualSorting:!1},[z,Wn]=a.useState(!1),[r,V]=a.useState(n.data),k=n.columns,Zn=()=>{const o=Array.from({length:1e4},(l,c)=>({...r[c],id:`person-${r.length+c}`,person:`Most interest in ${r.length+c}`,mostInterestIn:`Most interest in ${r.length+c}`,age:c+1}));V([...r,...o])};a.useState(n.containerHeight);const[Un,we]=a.useState(n.containerHeight),{autoScroll:qn,renderSubComponent:Gn,subComponentHeight:Qn,maxRowHeight:Xn,isLoading:Yn,size:ne,variant:ee,totalCount:te,topbar:se,hideHeader:ie}=n,{filters:$,addFilter:re,removeFilter:ae}=Ie(),[oe,le]=a.useState({}),[N,ce]=a.useState({}),ge=o=>{const l=O(n.data,!o||o.length===0?$:[{key:"person",value:L,comparator:fe.Includes},...$]);V(l)},[de,me]=a.useState({}),ue=a.useMemo(()=>k.map(o=>({...o,..."sorting"in n&&{isSortable:!0},..."search"in n&&{isSearchable:!0},..."filters"in n&&{isFilterable:!0}})),[k,n]),he=a.useMemo(()=>r==null?void 0:r.map((o,l)=>({...o,..."subRows"in n&&{subRows:Array.from({length:5},(c,D)=>({id:`sub-${l}-${D}`,person:`Most interest in ${D+(l*2+888888)}`,mostInterestIn:`Most interest in ${D+(l*2+888888)}`,age:D+(l*2+888888)}))}})),[r,n]);return s.jsxs(s.Fragment,{children:[s.jsx(Jn,{columns:ue,data:O(he,$),..."size"in n&&{size:ne},..."variant"in n&&{variant:ee},..."containerHeight"in n&&{containerHeight:Un},..."manualSorting"in n&&{sorting:{...Bn}},..."onFetchAllPages"in n&&!z&&{hasNextPage:!0,onFetchAllPages:()=>{Wn(!0),Zn()}},..."onFetchNextPage"in n&&!z&&{hasNextPage:!0,onFetchNextPage:()=>V([...r,{id:`person-${r.length+1}`,person:`Person ${r.length+1}`,mostInterestIn:`Most interest in ${r.length+1}`,age:r.length+1}])},..."hideHeader"in n&&{hideHeader:ie},..."renderSubComponent"in n&&{renderSubComponent:Gn},..."subComponentHeight"in n&&{subComponentHeight:Qn},..."maxRowHeight"in n&&{maxRowHeight:Xn},..."isLoading"in n&&{isLoading:Yn},..."totalCount"in n&&{totalCount:te},..."expandable"in n&&{expandable:{expanded:de,setExpanded:me}},..."autoScroll"in n&&{autoScroll:qn},..."columnVisibility"in n&&{columnVisibility:{columnVisibility:oe,setColumnVisibility:le}},..."topbar"in n&&{topbar:se},..."filters"in n&&{filters:{filters:$,add:re,remove:ae}},..."search"in n&&{search:{searchInput:L,setSearchInput:Kn,onSearch:ge}},..."rowSelection"in n&&{rowSelection:{rowSelection:N,setRowSelection:ce}}}),((_=Object.keys(N))==null?void 0:_.length)>0&&s.jsxs("div",{className:"p-4",children:[s.jsx("h3",{children:"Row Selection"}),s.jsx("div",{className:"bg-gray-100 p-2 rounded-md",children:JSON.stringify(N)})]})]})},g=t.bind({});g.args={columns:e,data:i};g.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          
          const columns = [
            {
              'id': 'Person',
              'label': 'Person',
              'accessorKey': 'person',
              'header': 'Person',
              'cell': ({ getValue }) => <div>{getValue()}</div>,
            },
            {
              'id': 'Most interest in',
              'label': 'Most interest in',
              'accessorKey': 'mostInterestIn',
              'header': 'Most interest in',
              'cell': ({ getValue }) => <div>{getValue()}</div>,
            },
            {
              'id': 'Age',
              'label': 'Age',
              'accessorKey': 'age',
              'header': 'Age',
              'cell': ({ getValue }) => <div>{getValue()}</div>,
            },
          ];
          const data = [
            {
              'id': '1',
              'person': 'John Doe',
              'mostInterestIn': 'HTML tables',
              'age': 25,
            },
            {
              'id': '2',
              'person': 'Jane Doe',
              'mostInterestIn': 'Web accessibility',
              'age': 26,
            },
            {
              'id': '3',
              'person': 'Sarah',
              'mostInterestIn': 'JavaScript frameworks',
              'age': 25,
            },
            {
              'id': '4',
              'person': 'Karen',
              'mostInterestIn': 'Web performance',
              'age': 26,
            },
          ];
          return (
            <Datagrid
              columns={columns}
              data={data}
            />
          );
          `.trim()}}};const d=t.bind({});d.args={columns:e,data:i,size:P.sm};d.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid, TABLE_SIZE } from '@ovh-ux/muk';
          return (
            <Datagrid
              columns={columns}
              data={data}
              size={TABLE_SIZE.sm}
            />
          );
          `.trim()}}};const m=t.bind({});m.args={columns:e,data:i,variant:E.striped};m.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid, TABLE_VARIANT } from '@ovh-ux/muk';
          return (
            <Datagrid
              columns={columns}
              data={data}
              variant={TABLE_VARIANT.striped}
            />
          );
          `.trim()}}};const u=t.bind({});u.args={columns:e,data:i,manualSorting:!1,sorting:{sorting:[],setSorting:()=>{},manualSorting:!1}};u.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid, SortingState, useDataApi } from '@ovh-ux/muk';
          // an exemple with dedicated server data
          const { sorting } = useDataApi({
            route: '/dedicated/server',
            version: 'v6',
            cacheKey: ['dedicated-server'],
            iceberg: true,
            enabled: true,
          });
          return (
            <Datagrid
              columns={columns}
              data={data}
              manualSorting={false}
              sorting={{
                sorting: sorting?.sorting,
                setSorting: sorting?.setSorting,
                manualSorting: true,
              }}
            />
          );
          `.trim()}}};const h=t.bind({});h.args={columns:e,data:[],isLoading:!0};h.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          return (
            <Datagrid
              columns={columns}
              data={data}
              isLoading={true}
            />
          );
          `.trim()}}};const p=t.bind({});p.args={columns:e,data:[...i],hasNextPage:!0,onFetchNextPage:()=>{}};p.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid, useDataApi } from '@ovh-ux/muk';
          const { hasNextPage, fetchNextPag, hasNextPage } = useDataApi({
            route: '/dedicated/server',
            version: 'v6',
            cacheKey: ['dedicated-server'],
            iceberg: true,
            enabled: true,
          });
          return (
            <Datagrid
              columns={columns}
              data={data}
              hasNextPage={hasNextPage}
              onFetchNextPage={fetchNextPage}
            />
          );
          `.trim()}}};const S=t.bind({});S.args={columns:e,data:[...i],manualSorting:!1,hasNextPage:!0,onFetchAllPages:()=>{},onFetchNextPage:()=>{}};S.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid, useDataApi } from '@ovh-ux/muk';
          const { hasNextPage, onFetchAllPages, fetchNextPage } = useDataApi({
            route: '/dedicated/server',
            version: 'v6',
            cacheKey: ['dedicated-server'],
            iceberg: true,
            enabled: true,
          });
          return (
            <Datagrid
              columns={columns}
              data={data}
              hasNextPage={hasNextPage}
              onFetchAllPages={onFetchAllPages}
              onFetchNextPage={fetchNextPage}
            />
          );
          `.trim()}}};const x=t.bind({});x.args={columns:e,data:[...i],autoScroll:!1,renderSubComponent:n=>s.jsxs(s.Fragment,{children:[s.jsx("div",{children:n.original.person}),s.jsx("div",{children:n.original.mostInterestIn}),s.jsx("div",{children:n.original.age})]}),subComponentHeight:80,size:P.md};x.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          return (
            <Datagrid
              columns={columns}
              data={data}
              renderSubComponent={(row) => (
                <>
                  <div>{row.original.person}</div>
                  <div>{row.original.mostInterestIn}</div>
                  <div>{row.original.age}</div>
                </>
              )}
              subComponentHeight={80}
              size={TABLE_SIZE.md}
            />
          );
          `.trim()}}};const b=t.bind({});b.args={columns:e,data:[...i],expandable:{expanded:{},setExpanded:()=>{}},autoScroll:!1,subComponentHeight:80,subRows:!0};b.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          import { ExpandedState } from '@tanstack/react-table';
          const [expanded, setExpanded] = useState<ExpandedState>({});
          const items = [
            {
              'id': '1',
              'person': 'John Doe',
              'age': 25,
              'mostInterestIn': 'HTML tables',
              'subRows': [
                {
                  'id': '99',
                  'person': 'Joahn Cruyff',
                  'age': 26,
                },
              ]
            },
            {
              'id': '2',
              'person': 'Jane Doe',
              'age': 26,
              'mostInterestIn': 'Web accessibility',
              'subRows': [
                {
                  'id': '100',
                  'person': 'Michel Platini',
                  'age': 28,
                },
              ]
            },
            {
              'id': '3',
              'person': 'Sarah',
              'age': 25,
              'mostInterestIn': 'JavaScript frameworks',
              'subRows': [
                {
                  'id': '101',
                  'person': 'Lionel Messi',
                  'age': 27,
                },
              ]
            }
            {
              'id': '4',
              'person': 'Karen',
              'age': 26,
              'mostInterestIn': 'Web performance',
              'subRows': [
                {
                  'id': '102',
                  'person': 'Cristiano Ronaldo',
                  'age': 28,
                },
              ]
            }
          ];
          return (
            <Datagrid
              columns={columns}
              data={data}
              expandable={{
                expanded: expanded,
                setExpanded: setExpanded,
                getRowCanExpand: (row: any) => row?.original?.age === 26,
              }}
              autoScroll={false}
              subComponentHeight={80}
            />
          );
          `.trim()}}};const I=t.bind({});I.args={columns:e,data:[...i],manualSorting:!1,columnVisibility:{columnVisibility:{person:!0,mostInterestIn:!0,age:!0},setColumnVisibility:()=>{}}};I.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          import { VisibilityState } from '@tanstack/react-table';
          const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
          const columns = [
            {
              'id': 'Person',
              'label': 'Person',
              'accessorKey': 'person',
              'header': 'Person',
              'enableHiding': true,
              'cell': ({ getValue }) => <div>{getValue()}</div>,
            },
            {
              'id': 'Most interest in',
              'label': 'Most interest in',
              'accessorKey': 'mostInterestIn',
              'header': 'Most interest in',
              'enableHiding': true,
              'cell': ({ getValue }) => <div>{getValue()}</div>,
            },
            {
              'id': 'Age',
              'label': 'Age',
              'accessorKey': 'age',
              'header': 'Age',
              'enableHiding': true,
              'cell': ({ getValue }) => <div>{getValue()}</div>,
            },
          ];
          return (
            <Datagrid
              columns={columns}
              data={data}
              manualSorting={false}
              columnVisibility={
                columnVisibility,
                setColumnVisibility,
              }
            />
          );
          `.trim()}}};const y=t.bind({});y.args={columns:e,data:[...i],filters:{filters:[],add:()=>{},remove:()=>{}}};y.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid, useDataApi } from '@ovh-ux/muk';
          const { filters } = useDataApi({
            route: '/dedicated/server',
            version: 'v6',
            cacheKey: ['dedicated-server'],
            iceberg: true,
            enabled: true,
          });
          return (
            <Datagrid
              columns={columns}
              data={data}
              filters={{
                filters: filters?.filters,
                add: filters?.add,
                remove: filters?.remove,
              }}
            />
          );
          `.trim()}}};const f=t.bind({});f.args={columns:e,data:[...i],search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}}};f.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid, useDataApi } from '@ovh-ux/muk';
          const { searchInput, setSearchInput, onSearch } = useDataApi({
            route: '/dedicated/server',
            version: 'v6',
            cacheKey: ['dedicated-server'],
            iceberg: true,
            enabled: true,
          });
          return (
            <Datagrid
              columns={columns}
              data={data}
              search={{
                searchInput: '',
                setSearchInput: () => {},
                onSearch: () => {},
              }}
            />
          );
          `.trim()}}};const w=t.bind({});w.args={columns:e,data:[...i],rowSelection:{rowSelection:[],setRowSelection:()=>{},onRowSelectionChange:()=>{},enableRowSelection:n=>{var R;return((R=n==null?void 0:n.original)==null?void 0:R.age)===26}}};w.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          import { RowSelectionState } from '@tanstack/react-table';

          const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
          return (
            <Datagrid
              columns={columns}
              data={data}
              rowSelection={{
                rowSelection: [],
                setRowSelection: () => {},
                onRowSelectionChange: () => {},
                enableRowSelection: (row: Row<DatagridStoryData>) => row?.original?.age === 26,
              }}
            />
          );
          `.trim()}}};const A=t.bind({});A.args={columns:e,data:[...i],hideHeader:!0};A.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          return (
            <Datagrid
              columns={columns}
              data={data}
              hideHeader={true}
            />
          );
          `.trim()}}};const F=t.bind({});F.args={columns:e,data:[...i],topbar:s.jsx("div",{children:s.jsxs(xe,{size:be.sm,children:[s.jsx(pe,{name:Se.plus}),"Add New"]})}),filters:{filters:[],add:()=>{},remove:()=>{}},search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}},rowSelection:{rowSelection:[],setRowSelection:()=>{},onRowSelectionChange:()=>{}},columnVisibility:{columnVisibility:{person:!0,mostInterestIn:!0,age:!0},setColumnVisibility:()=>{}}};F.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          return (
            <Datagrid
              columns={columns}
              data={data}
              topbar={
                <div>
                  <Button size={BUTTON_SIZE.sm}>
                    <Icon name={ICON_NAME.plus} />
                    Add New
                  </Button>
                </div>
              }
              filters={{
                filters: [],
                add: () => {},
                remove: () => {},
              }}
              search={{
                searchInput: '',
                setSearchInput: () => {},
                onSearch: () => {},
              }}
              rowSelection={{
                rowSelection: [],
                setRowSelection: () => {},
                onRowSelectionChange: () => {},
                enableRowSelection: (row: Row<DatagridStoryData>) => row?.original?.age === 26,
              }}
              columnVisibility={{
                columnVisibility: { person: true, mostInterestIn: true, age: true },
                setColumnVisibility: () => {},
              }}
            />
          );
          `.trim()}}};const H=t.bind({});H.args={columns:e,data:[...i],totalCount:4};H.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          return (
            <Datagrid
              columns={columns}
              data={data}
              totalCount={4}
            />
          );
          `.trim()}}};const C=t.bind({});C.args={columns:e,data:[...i],resourceType:"dedicated-server"};C.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid } from '@ovh-ux/muk';
          return (
            <Datagrid
              columns={columns}
              data={data}
              resourceType="dedicated-server"
            />
          );
          `.trim()}}};const v=t.bind({});v.args={columns:e,data:[...i],hasNextPage:!0,onFetchAllPages:()=>{},onFetchNextPage:()=>{},totalCount:4};v.parameters={docs:{source:{format:"dedent",transform:()=>`import { Datagrid, useDataApi } from '@ovh-ux/muk';
          import { VisibilityState, RowSelectionState } from '@tanstack/react-table';
          
          const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
          const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
          const { filters, search } = useDataApi({
            route: '/dedicated/server',
            version: 'v6',
            cacheKey: ['dedicated-server'],
            iceberg: true,
            enabled: true,
          });
          return (
            <Datagrid
              columns={columns}
              data={data}
              hasNextPage={true}
              onFetchAllPages={() => {}}
              onFetchNextPage={() => {}}
              totalCount={4}
              topbar={
                <div>
                  <Button size={BUTTON_SIZE.sm}>
                    <Icon name={ICON_NAME.plus} />
                    Add New
                  </Button>
                </div>
              }
              filters={filters}
              search={search}
              rowSelection={rowSelection}
              columnVisibility={columnVisibility}
            />
          );
          `.trim()}}};const ze={title:"Manager UI Kit/Components/Datagrid",component:Jn,tags:["autodocs"],decorators:[ye],parameters:{docs:{description:{component:'The `Datagrid` component provides a powerful data table with built-in pagination controls. The footer actions section includes "Load More" and "Load All" buttons for progressive data loading.'}},preserveArgs:!1},args:{containerHeight:250},argTypes:{size:{description:"Controls the table row size",control:"select",options:[P.sm,P.md,P.lg]},variant:{description:"Controls the table variant style",control:"select",options:[E.default,E.striped]},hasNextPage:{description:"Controls whether pagination buttons are shown",control:"boolean"},isLoading:{description:"Shows loading state on pagination buttons",control:"boolean"}}};var j,J,T;g.parameters={...g.parameters,docs:{...(j=g.parameters)==null?void 0:j.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(T=(J=g.parameters)==null?void 0:J.docs)==null?void 0:T.source}}};var K,B,W;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(W=(B=d.parameters)==null?void 0:B.docs)==null?void 0:W.source}}};var Z,U,q;m.parameters={...m.parameters,docs:{...(Z=m.parameters)==null?void 0:Z.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(q=(U=m.parameters)==null?void 0:U.docs)==null?void 0:q.source}}};var G,Q,X;u.parameters={...u.parameters,docs:{...(G=u.parameters)==null?void 0:G.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(X=(Q=u.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,nn,en;h.parameters={...h.parameters,docs:{...(Y=h.parameters)==null?void 0:Y.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(en=(nn=h.parameters)==null?void 0:nn.docs)==null?void 0:en.source}}};var tn,sn,rn;p.parameters={...p.parameters,docs:{...(tn=p.parameters)==null?void 0:tn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(rn=(sn=p.parameters)==null?void 0:sn.docs)==null?void 0:rn.source}}};var an,on,ln;S.parameters={...S.parameters,docs:{...(an=S.parameters)==null?void 0:an.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(ln=(on=S.parameters)==null?void 0:on.docs)==null?void 0:ln.source}}};var cn,gn,dn;x.parameters={...x.parameters,docs:{...(cn=x.parameters)==null?void 0:cn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(dn=(gn=x.parameters)==null?void 0:gn.docs)==null?void 0:dn.source}}};var mn,un,hn;b.parameters={...b.parameters,docs:{...(mn=b.parameters)==null?void 0:mn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(hn=(un=b.parameters)==null?void 0:un.docs)==null?void 0:hn.source}}};var pn,Sn,xn;I.parameters={...I.parameters,docs:{...(pn=I.parameters)==null?void 0:pn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(xn=(Sn=I.parameters)==null?void 0:Sn.docs)==null?void 0:xn.source}}};var bn,In,yn;y.parameters={...y.parameters,docs:{...(bn=y.parameters)==null?void 0:bn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(yn=(In=y.parameters)==null?void 0:In.docs)==null?void 0:yn.source}}};var fn,wn,An;f.parameters={...f.parameters,docs:{...(fn=f.parameters)==null?void 0:fn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(An=(wn=f.parameters)==null?void 0:wn.docs)==null?void 0:An.source}}};var Fn,Hn,Cn;w.parameters={...w.parameters,docs:{...(Fn=w.parameters)==null?void 0:Fn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(Cn=(Hn=w.parameters)==null?void 0:Hn.docs)==null?void 0:Cn.source}}};var vn,Pn,Rn;A.parameters={...A.parameters,docs:{...(vn=A.parameters)==null?void 0:vn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(Rn=(Pn=A.parameters)==null?void 0:Pn.docs)==null?void 0:Rn.source}}};var $n,Dn,Vn;F.parameters={...F.parameters,docs:{...($n=F.parameters)==null?void 0:$n.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(Vn=(Dn=F.parameters)==null?void 0:Dn.docs)==null?void 0:Vn.source}}};var Nn,Mn,En;H.parameters={...H.parameters,docs:{...(Nn=H.parameters)==null?void 0:Nn.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(En=(Mn=H.parameters)==null?void 0:Mn.docs)==null?void 0:En.source}}};var Ln,zn,kn;C.parameters={...C.parameters,docs:{...(Ln=C.parameters)==null?void 0:Ln.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(kn=(zn=C.parameters)==null?void 0:zn.docs)==null?void 0:kn.source}}};var _n,On,jn;v.parameters={...v.parameters,docs:{...(_n=v.parameters)==null?void 0:_n.docs,source:{originalSource:`(args: DatagridProps<DatagridStoryData>) => {
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
}`,...(jn=(On=v.parameters)==null?void 0:On.docs)==null?void 0:jn.source}}};const ke=["Default","Size","Variant","Sorting","Loading","LoadMore","LoadAllAndLoading","SubComponent","Expandable","VisibilityColumns","Filtering","Search","RowSelection","HideHeader","Topbar","TotalCount","ResourceType","FullFooter"];export{g as Default,b as Expandable,y as Filtering,v as FullFooter,A as HideHeader,S as LoadAllAndLoading,p as LoadMore,h as Loading,C as ResourceType,w as RowSelection,f as Search,d as Size,u as Sorting,x as SubComponent,F as Topbar,H as TotalCount,m as Variant,I as VisibilityColumns,ke as __namedExportsOrder,ze as default};
