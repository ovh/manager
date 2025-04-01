import{j as t}from"./jsx-runtime-CKrituN3.js";import{r as C}from"./index-CBqU2yxZ.js";import{b as me,c as pe}from"./index-BoGQ30sD.js";import{c as ue,b as he}from"./index-CqmMgYso.js";import{K as ge,u as de}from"./index-lGtsexrg.js";import{D as P,a as Se}from"./datagrid.component-Can8N-LX.js";import{u as be,a as V,F as ye}from"./useColumnFilters-YA9pzFQ4.js";import{c as s,a as fe,b as Ce,d as Ie}from"./datagrid.mock-B7YvIcR0.js";import"./card.component-nt1Q_mnc.js";import{A as Pe}from"./action.component-DETXVUga.js";import"./guide.component-CgAD5bS3.js";import"./changelog.component-CsN4ogkC.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-BkDLP3dD.js";import"./clsx-B-dksMZM.js";import"./useTranslation-pmbu4BU3.js";import"./i18next-ihUiNgJT.js";import"./title.component-Bx3BQPQH.js";import"./links.component-B_FCtcjf.js";import"./translation-xx6Js1fi.js";import"./ManagerButton-C8zC-Fyb.js";import"./useOvhIam-puHWDhg2.js";import"./QueryClientProvider-DWOoNJcY.js";import"./useOvhTracking-C-_VjZ5i.js";const r=e=>{const[a,I]=C.useState(),[n,i]=C.useState(e.items),[x]=de(),{filters:f,addFilter:re,removeFilter:se}=be(),[F,oe]=C.useState(""),ie=()=>{const o=n==null?void 0:n.length,l=[...Array(10).keys()].map((D,ce)=>({label:`Item #${ce+o}`,price:Math.floor(1+Math.random()*100)}));i(D=>[...D,...l])},v=C.useMemo(()=>{var o;return(o=e==null?void 0:e.columns)==null?void 0:o.find(l=>Object.prototype.hasOwnProperty.call(l,"isSearchable"))},[s]),le=o=>{if(v){const l=V(e.items,!o||o.length===0?f:[{key:v.id,value:F,comparator:ye.Includes},...f]);i(l)}};return t.jsxs(t.Fragment,{children:[`${x}`&&t.jsxs(t.Fragment,{children:[t.jsxs("pre",{children:["Search params: ?",`${x}`]}),t.jsx(me,{})]}),t.jsx(P,{items:V(n,f),columns:e.columns,hasNextPage:(n==null?void 0:n.length)>0&&n.length<30,onFetchNextPage:ie,totalItems:n==null?void 0:n.length,filters:{filters:f,add:re,remove:se},columnVisibility:e.columnVisibility,onColumnVisibilityChange:e.onColumnVisibilityChange,topbar:e.topbar,isLoading:e.isLoading,...e.search?{search:{searchInput:F,setSearchInput:oe,onSearch:le}}:{},getRowCanExpand:e.getRowCanExpand,renderSubComponent:e.renderSubComponent,...e.isSortable?{sorting:a,onSortChange:I,manualSorting:!1}:{}})]})},c=r.bind({});c.args={columns:s,items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),totalItems:20,isSortable:!1,onFetchNextPage:!0,columnVisibility:[]};const m=r.bind({});m.args={columns:s,items:[]};const p=r.bind({});p.args={columns:s,items:[],isLoading:!0};const u=r.bind({});u.args={columns:s,items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const xe={id:"actions",cell:e=>e.actions,label:""},h=r.bind({});h.args={columns:[...s,xe],items:[...Array(8).keys()].map((e,a)=>({label:`Service #${a}`,price:Math.floor(1+Math.random()*100),actions:t.jsx("div",{className:"flex items-center justify-center",children:t.jsx("div",{children:t.jsx(Pe,{isCompact:!0,variant:ue.ghost,id:a.toString(),items:[{id:1,target:"_blank",label:"Action 1",urn:"urn:v9:eu:resource:manatestkds-fdsfsd",iamActions:["vrackServices:apiovh:iam/resource/update"]},{id:2,target:"_blank",label:"Action 2",urn:"urn:v9:eu:resource:manate",iamActions:["vrackServices:apiovh:iam/resource/delete"]}]})})})})),isSortable:!0};const g=r.bind({});g.args={items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),columns:fe};const d=r.bind({});d.args={columnVisibility:["label","price"],items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),columns:Ce,onColumnVisibilityChange:void 0};const S=r.bind({}),Fe=()=>t.jsx(pe,{label:"Add item",icon:he.plus});S.args={items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100),status:`Status #${a}`})),columns:Ie,search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}},topbar:t.jsx(Fe,{}),onColumnVisibilityChange:void 0};const b=r.bind({});b.args={columns:s,items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:e=>t.jsx(Se,{children:JSON.stringify(e.original)})};const y=r.bind({});y.args={columns:s,items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:(e,a)=>{const I=s.map(i=>({...i,size:a.current[i.id].clientWidth}));return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
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
    `}),t.jsx(P,{columns:I,items:[{label:"sub component label",price:10},{label:"sub component label #2",price:100}],totalItems:2,hideHeader:!0,tableLayoutFixed:!0})]})}};const Qe={title:"Components/Datagrid Cursor",component:P,decorators:[ge]};var M,N,w;c.parameters={...c.parameters,docs:{...(M=c.parameters)==null?void 0:M.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(w=(N=c.parameters)==null?void 0:N.docs)==null?void 0:w.source}}};var $,O,k;m.parameters={...m.parameters,docs:{...($=m.parameters)==null?void 0:$.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(k=(O=m.parameters)==null?void 0:O.docs)==null?void 0:k.source}}};var A,E,j;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(j=(E=p.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};var _,L,R;u.parameters={...u.parameters,docs:{...(_=u.parameters)==null?void 0:_.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(R=(L=u.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};var T,W,B;h.parameters={...h.parameters,docs:{...(T=h.parameters)==null?void 0:T.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(B=(W=h.parameters)==null?void 0:W.docs)==null?void 0:B.source}}};var K,z,G;g.parameters={...g.parameters,docs:{...(K=g.parameters)==null?void 0:K.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(G=(z=g.parameters)==null?void 0:z.docs)==null?void 0:G.source}}};var H,J,U;d.parameters={...d.parameters,docs:{...(H=d.parameters)==null?void 0:H.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(U=(J=d.parameters)==null?void 0:J.docs)==null?void 0:U.source}}};var q,Q,X;S.parameters={...S.parameters,docs:{...(q=S.parameters)==null?void 0:q.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(X=(Q=S.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;b.parameters={...b.parameters,docs:{...(Y=b.parameters)==null?void 0:Y.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(ee=(Z=b.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var ae,te,ne;y.parameters={...y.parameters,docs:{...(ae=y.parameters)==null?void 0:ae.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
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
      <Datagrid items={applyFilters(data, filters)} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
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
    } : {}} />
    </>;
}`,...(ne=(te=y.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};const Xe=["Basic","Empty","Loading","Sortable","WithActions","Filters","Visibility","Topbar","WithSubComponent","WithDatagridSubComponent"];export{c as Basic,m as Empty,g as Filters,p as Loading,u as Sortable,S as Topbar,d as Visibility,h as WithActions,y as WithDatagridSubComponent,b as WithSubComponent,Xe as __namedExportsOrder,Qe as default};
