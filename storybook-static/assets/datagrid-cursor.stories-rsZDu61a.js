import{j as t}from"./jsx-runtime-CKrituN3.js";import{r as I}from"./index-CBqU2yxZ.js";import{b as he,c as ue}from"./index-BoGQ30sD.js";import{c as de,b as Se}from"./index-CqmMgYso.js";import{K as be,u as ye}from"./index-lGtsexrg.js";import{D as v,a as Pe}from"./datagrid.component-BWwsgqBg.js";import{u as fe,a as $,F as xe}from"./useColumnFilters-RgZVa838.js";import{c as i,a as Ie,b as Ce,d as Fe}from"./datagrid.mock-DBM7kmk8.js";import"./card.component-nt1Q_mnc.js";import{A as ve}from"./action.component-DETXVUga.js";import"./guide.component-CgAD5bS3.js";import"./changelog.component-CsN4ogkC.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-BkDLP3dD.js";import"./clsx-B-dksMZM.js";import"./useTranslation-pmbu4BU3.js";import"./i18next-ihUiNgJT.js";import"./title.component-Bx3BQPQH.js";import"./links.component-B_FCtcjf.js";import"./translation-xx6Js1fi.js";import"./ManagerButton-C8zC-Fyb.js";import"./useOvhIam-puHWDhg2.js";import"./QueryClientProvider-DWOoNJcY.js";import"./useOvhTracking-C-_VjZ5i.js";const s=10,V=3,o=e=>{const[a,C]=I.useState(),[n,c]=I.useState(e.items),[A]=ye(),{filters:x,addFilter:ie,removeFilter:le}=fe(),[M,ce]=I.useState(""),me=()=>{const r=n==null?void 0:n.length,l=[...Array(s).keys()].map((m,F)=>({label:`Item #${F+r}`,price:Math.floor(1+Math.random()*100)}));c(m=>[...m,...l])},pe=()=>{const r=n==null?void 0:n.length,l=[...Array(s*V-r).keys()].map((m,F)=>({label:`Item #${F+r}`,price:Math.floor(1+Math.random()*100)}));c(m=>[...m,...l])},D=I.useMemo(()=>{var r;return(r=e==null?void 0:e.columns)==null?void 0:r.find(l=>Object.prototype.hasOwnProperty.call(l,"isSearchable"))},[i]),ge=r=>{if(D){const l=$(e.items,!r||r.length===0?x:[{key:D.id,value:M,comparator:xe.Includes},...x]);c(l)}};return t.jsxs(t.Fragment,{children:[`${A}`&&t.jsxs(t.Fragment,{children:[t.jsxs("pre",{children:["Search params: ?",`${A}`]}),t.jsx(he,{})]}),t.jsx(v,{items:$(n,x),columns:e.columns,hasNextPage:(n==null?void 0:n.length)&&n.length<V*s,onFetchNextPage:me,onFetchAllPages:pe,totalItems:n==null?void 0:n.length,filters:{filters:x,add:ie,remove:le},columnVisibility:e.columnVisibility,onColumnVisibilityChange:e.onColumnVisibilityChange,topbar:e.topbar,isLoading:e.isLoading,...e.search?{search:{searchInput:M,setSearchInput:ce,onSearch:ge}}:{},getRowCanExpand:e.getRowCanExpand,renderSubComponent:e.renderSubComponent,...e.isSortable?{sorting:a,onSortChange:C,manualSorting:!1}:{}})]})},p=o.bind({});p.args={columns:i,items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),totalItems:20,isSortable:!1,onFetchNextPage:!0};const g=o.bind({});g.args={columns:i,items:[]};const h=o.bind({});h.args={columns:i,items:[],isLoading:!0};const u=o.bind({});u.args={columns:i,items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const Ae={id:"actions",cell:e=>e.actions,label:""},d=o.bind({});d.args={columns:[...i,Ae],items:[...Array(s).keys()].map((e,a)=>({label:`Service #${a}`,price:Math.floor(1+Math.random()*100),actions:t.jsx("div",{className:"flex items-center justify-center",children:t.jsx("div",{children:t.jsx(ve,{isCompact:!0,variant:de.ghost,id:a.toString(),items:[{id:1,target:"_blank",label:"Action 1",urn:"urn:v9:eu:resource:manatestkds-fdsfsd",iamActions:["vrackServices:apiovh:iam/resource/update"]},{id:2,target:"_blank",label:"Action 2",urn:"urn:v9:eu:resource:manate",iamActions:["vrackServices:apiovh:iam/resource/delete"]}]})})})})),isSortable:!0};const S=o.bind({});S.args={items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),columns:Ie};const b=o.bind({});b.args={columnVisibility:["label","price"],items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),columns:Ce,onColumnVisibilityChange:void 0};const y=o.bind({}),Me=()=>t.jsx(ue,{label:"Add item",icon:Se.plus});y.args={items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100),status:`Status #${a}`})),columns:Fe,search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}},topbar:t.jsx(Me,{}),onColumnVisibilityChange:void 0};const P=o.bind({});P.args={columns:i,items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:e=>t.jsx(Pe,{children:JSON.stringify(e.original)})};const f=o.bind({});f.args={columns:i,items:[...Array(s).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:(e,a)=>{const C=i.map(c=>({...c,size:a.current[c.id].clientWidth}));return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
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
    `}),t.jsx(v,{columns:C,items:[{label:"sub component label",price:10},{label:"sub component label #2",price:100}],totalItems:2,hideHeader:!0,tableLayoutFixed:!0})]})}};const Ze={title:"Components/Datagrid Cursor",component:v,decorators:[be]};var N,k,w;p.parameters={...p.parameters,docs:{...(N=p.parameters)==null?void 0:N.docs,source:{originalSource:`args => {
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
}`,...(w=(k=p.parameters)==null?void 0:k.docs)==null?void 0:w.source}}};var O,_,z;g.parameters={...g.parameters,docs:{...(O=g.parameters)==null?void 0:O.docs,source:{originalSource:`args => {
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
}`,...(z=(_=g.parameters)==null?void 0:_.docs)==null?void 0:z.source}}};var E,j,L;h.parameters={...h.parameters,docs:{...(E=h.parameters)==null?void 0:E.docs,source:{originalSource:`args => {
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
}`,...(L=(j=h.parameters)==null?void 0:j.docs)==null?void 0:L.source}}};var R,T,W;u.parameters={...u.parameters,docs:{...(R=u.parameters)==null?void 0:R.docs,source:{originalSource:`args => {
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
}`,...(W=(T=u.parameters)==null?void 0:T.docs)==null?void 0:W.source}}};var B,K,G;d.parameters={...d.parameters,docs:{...(B=d.parameters)==null?void 0:B.docs,source:{originalSource:`args => {
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
}`,...(G=(K=d.parameters)==null?void 0:K.docs)==null?void 0:G.source}}};var H,J,U;S.parameters={...S.parameters,docs:{...(H=S.parameters)==null?void 0:H.docs,source:{originalSource:`args => {
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
}`,...(U=(J=S.parameters)==null?void 0:J.docs)==null?void 0:U.source}}};var q,Q,X;b.parameters={...b.parameters,docs:{...(q=b.parameters)==null?void 0:q.docs,source:{originalSource:`args => {
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
}`,...(X=(Q=b.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,ee;y.parameters={...y.parameters,docs:{...(Y=y.parameters)==null?void 0:Y.docs,source:{originalSource:`args => {
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
}`,...(ee=(Z=y.parameters)==null?void 0:Z.docs)==null?void 0:ee.source}}};var ae,te,ne;P.parameters={...P.parameters,docs:{...(ae=P.parameters)==null?void 0:ae.docs,source:{originalSource:`args => {
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
}`,...(ne=(te=P.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};var se,re,oe;f.parameters={...f.parameters,docs:{...(se=f.parameters)==null?void 0:se.docs,source:{originalSource:`args => {
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
}`,...(oe=(re=f.parameters)==null?void 0:re.docs)==null?void 0:oe.source}}};const ea=["Basic","Empty","Loading","Sortable","WithActions","Filters","Visibility","Topbar","WithSubComponent","WithDatagridSubComponent"];export{p as Basic,g as Empty,S as Filters,h as Loading,u as Sortable,y as Topbar,b as Visibility,d as WithActions,f as WithDatagridSubComponent,P as WithSubComponent,ea as __namedExportsOrder,Ze as default};
