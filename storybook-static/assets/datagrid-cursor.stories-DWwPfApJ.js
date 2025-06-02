import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{r as C}from"./index-Bnop-kX6.js";import{b as be,c as ye}from"./index-CNSIveXf.js";import{c as Pe,b as fe}from"./index-D-q5QNgV.js";import{K as xe,u as Ie}from"./index-jll95z9C.js";import{d as A,A as Ce,e as Fe,u as ve,f as N,F as Ae}from"./ManagerButton-koF735LD.js";import{c as i,a as Me,b as De,d as $e,e as Ne}from"./datagrid.mock-Bgk5zlB5.js";import"./card.component-BToc7KuX.js";import"./guide.component-Bw7Cznhp.js";import"./changelog.component-bWd8ittI.js";import"./index-4pTrEEYx.js";import"./ods-toggle2-BJ1toRrr.js";import"./index-CwE47CCN.js";import"./i18next-6HYnolD1.js";import"./QueryClientProvider-DAxw80nV.js";import"./useOvhTracking-Cqpl1sX8.js";import"./clipboard.component-CmhF-xNN.js";import"./useTranslation-DQ7TG6Ul.js";import"./context-BG98Yt4t.js";import"./Step.component-Bds2cN4H.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./Tabs.component-C_dEyA9f.js";import"./TilesInput.component-C_qU074F.js";import"./title.component-ucIeg-_K.js";import"./links.component-DnFRtS4w.js";import"./price.component-CleweYwa.js";import"./translation-DkLW9Uck.js";import"./error.component-Mbm_PMBt.js";import"./error-boundary.component-CFspuVW9.js";import"./delete-modal.component-4eOUWoLS.js";import"./click-utils-ByCElPrV.js";import"./update-name-modal.component-BuaziZw6.js";import"./notifications.component-BC7nyudf.js";import"./PciMaintenanceBanner.component-CFf6hjH_.js";import"./region.component-7C7sLsDi.js";import"./Order.component-DWsKGSo7.js";import"./badge.component-WpuLrKbO.js";import"./Modal.component-BFD3_SRS.js";import"./tags-list.component-Cd9H7A1G.js";const s=10,V=3,r=e=>{const[a,F]=C.useState(),[n,m]=C.useState(e.items),[M]=Ie(),{filters:I,addFilter:pe,removeFilter:ge}=ve(),[D,he]=C.useState(""),ue=()=>{const o=n==null?void 0:n.length,l=[...Array(s).keys()].map((c,v)=>({label:`Item #${v+o}`,price:Math.floor(1+Math.random()*100)}));m(c=>[...c,...l])},de=()=>{const o=n==null?void 0:n.length,l=[...Array(s*V-o).keys()].map((c,v)=>({label:`Item #${v+o}`,price:Math.floor(1+Math.random()*100)}));m(c=>[...c,...l])},$=C.useMemo(()=>{var o;return(o=e==null?void 0:e.columns)==null?void 0:o.find(l=>Object.prototype.hasOwnProperty.call(l,"isSearchable"))},[i]),Se=o=>{if($){const l=N(e.items,!o||o.length===0?I:[{key:$.id,value:D,comparator:Ae.Includes},...I]);m(l)}};return t.jsxs(t.Fragment,{children:[`${M}`&&t.jsxs(t.Fragment,{children:[t.jsxs("pre",{children:["Search params: ?",`${M}`]}),t.jsx(be,{})]}),t.jsx(A,{items:N(n,I),columns:e.columns,hasNextPage:(n==null?void 0:n.length)&&n.length<V*s,onFetchNextPage:ue,onFetchAllPages:de,totalItems:n==null?void 0:n.length,filters:{filters:I,add:pe,remove:ge},columnVisibility:e.columnVisibility,onColumnVisibilityChange:e.onColumnVisibilityChange,topbar:e.topbar,isLoading:e.isLoading,...e.search?{search:{searchInput:D,setSearchInput:he,onSearch:Se}}:{},getRowCanExpand:e.getRowCanExpand,renderSubComponent:e.renderSubComponent,...e.isSortable?{sorting:a,onSortChange:F,manualSorting:!1}:{}})]})},p=r.bind({});p.args={columns:i,items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),totalItems:20,isSortable:!1,onFetchNextPage:!0};const g=r.bind({});g.args={columns:i,items:[]};const h=r.bind({});h.args={columns:i,items:[],isLoading:!0};const u=r.bind({});u.args={columns:i,items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const Ve={id:"actions",cell:e=>e.actions,label:""},d=r.bind({});d.args={columns:[...i,Ve],items:[...Array(s).keys()].map((e,a)=>({label:`Service #${a}`,price:Math.floor(1+Math.random()*100),actions:t.jsx("div",{className:"flex items-center justify-center",children:t.jsx("div",{children:t.jsx(Ce,{isCompact:!0,variant:Pe.ghost,id:a.toString(),items:[{id:1,target:"_blank",label:"Action 1",urn:"urn:v9:eu:resource:manatestkds-fdsfsd",iamActions:["vrackServices:apiovh:iam/resource/update"]},{id:2,target:"_blank",label:"Action 2",urn:"urn:v9:eu:resource:manate",iamActions:["vrackServices:apiovh:iam/resource/delete"]}]})})})})),isSortable:!0};const S=r.bind({});S.args={items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),columns:Me};const b=r.bind({});b.args={items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100),iam:{id:"test",urn:"urn:v9:eu:resource:manatestkds-fdsfsd",tags:{key1:`tag-1-${a}`,key2:`tag-2-${a}`,[a]:"value-test"}}})),columns:De};const y=r.bind({});y.args={items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),columns:$e,onColumnVisibilityChange:void 0};const P=r.bind({}),ke=()=>t.jsx(ye,{label:"Add item",icon:fe.plus});P.args={items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100),status:`Status #${a}`})),columns:Ne,search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}},topbar:t.jsx(ke,{}),onColumnVisibilityChange:void 0};const f=r.bind({});f.args={columns:i,items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:e=>t.jsx(Fe,{children:JSON.stringify(e.original)})};const x=r.bind({});x.args={columns:i,items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:(e,a)=>{const F=i.map(m=>({...m,size:a.current[m.id].clientWidth}));return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
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
    `}),t.jsx(A,{columns:F,items:[{label:"sub component label",price:10,status:""},{label:"sub component label #2",price:100,status:""}],totalItems:2,hideHeader:!0,tableLayoutFixed:!0})]})}};const Pa={title:"Components/Datagrid Cursor",component:A,decorators:[xe]};var k,w,O;p.parameters={...p.parameters,docs:{...(k=p.parameters)==null?void 0:k.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(O=(w=p.parameters)==null?void 0:w.docs)==null?void 0:O.source}}};var _,z,E;g.parameters={...g.parameters,docs:{...(_=g.parameters)==null?void 0:_.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(E=(z=g.parameters)==null?void 0:z.docs)==null?void 0:E.source}}};var j,L,R;h.parameters={...h.parameters,docs:{...(j=h.parameters)==null?void 0:j.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(R=(L=h.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};var T,W,B;u.parameters={...u.parameters,docs:{...(T=u.parameters)==null?void 0:T.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(B=(W=u.parameters)==null?void 0:W.docs)==null?void 0:B.source}}};var K,G,H;d.parameters={...d.parameters,docs:{...(K=d.parameters)==null?void 0:K.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(H=(G=d.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,U,q;S.parameters={...S.parameters,docs:{...(J=S.parameters)==null?void 0:J.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(q=(U=S.parameters)==null?void 0:U.docs)==null?void 0:q.source}}};var Q,X,Y;b.parameters={...b.parameters,docs:{...(Q=b.parameters)==null?void 0:Q.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(Y=(X=b.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var Z,ee,ae;y.parameters={...y.parameters,docs:{...(Z=y.parameters)==null?void 0:Z.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(ae=(ee=y.parameters)==null?void 0:ee.docs)==null?void 0:ae.source}}};var te,ne,se;P.parameters={...P.parameters,docs:{...(te=P.parameters)==null?void 0:te.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(se=(ne=P.parameters)==null?void 0:ne.docs)==null?void 0:se.source}}};var re,oe,ie;f.parameters={...f.parameters,docs:{...(re=f.parameters)==null?void 0:re.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(ie=(oe=f.parameters)==null?void 0:oe.docs)==null?void 0:ie.source}}};var le,me,ce;x.parameters={...x.parameters,docs:{...(le=x.parameters)==null?void 0:le.docs,source:{originalSource:`args => {
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
    } : {}} />
    </>;
}`,...(ce=(me=x.parameters)==null?void 0:me.docs)==null?void 0:ce.source}}};const fa=["Basic","Empty","Loading","Sortable","WithActions","Filters","FiltersWithTags","Visibility","Topbar","WithSubComponent","WithDatagridSubComponent"];export{p as Basic,g as Empty,S as Filters,b as FiltersWithTags,h as Loading,u as Sortable,P as Topbar,y as Visibility,d as WithActions,x as WithDatagridSubComponent,f as WithSubComponent,fa as __namedExportsOrder,Pa as default};
