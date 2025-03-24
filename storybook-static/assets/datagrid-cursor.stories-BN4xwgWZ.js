import{j as t}from"./jsx-runtime-CKrituN3.js";import{r as I}from"./index-CBqU2yxZ.js";import{b as oe,c as ce}from"./index-CsPFwKPW.js";import{O as ie,a as le}from"./index-DyaGuj67.js";import{K as me,u as pe}from"./index-1dq4XaDw.js";import{D as x,a as he}from"./datagrid.component-D0tTSFoZ.js";import{u as de,a as D,F as ue}from"./useColumnFilters--gkkB6Kq.js";import{c as r,a as ge,b as Se}from"./datagrid.mock-D9a4l1s6.js";import"./card.component-KUAJ_RGJ.js";import{A as be}from"./action.component-BUCSArox.js";import"./guide.component-VigYNDPS.js";import"./changelog.component-CipkhhT9.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-DaQ_SeLH.js";import"./clsx-B-dksMZM.js";import"./useTranslation-pmbu4BU3.js";import"./i18next-ihUiNgJT.js";import"./title.component-Bx3BQPQH.js";import"./links.component-YLeTnNxG.js";import"./translation-xx6Js1fi.js";import"./ManagerButton-DfE2onkM.js";import"./useOvhIam-puHWDhg2.js";import"./QueryClientProvider-DWOoNJcY.js";import"./useOvhTracking-CUqAIfBm.js";const s=e=>{const[a,P]=I.useState(),[n,c]=I.useState(e.items),[y]=pe(),{filters:f,addFilter:ee,removeFilter:ae}=de(),[C,te]=I.useState(""),ne=()=>{const o=n==null?void 0:n.length,i=[...Array(10).keys()].map((v,se)=>({label:`Item #${se+o}`,price:Math.floor(1+Math.random()*100)}));c(v=>[...v,...i])},F=I.useMemo(()=>{var o;return(o=e==null?void 0:e.columns)==null?void 0:o.find(i=>Object.prototype.hasOwnProperty.call(i,"isSearchable"))},[r]),re=o=>{if(F){const i=D(e.items,!o||o.length===0?f:[{key:F.id,value:C,comparator:ue.Includes},...f]);c(i)}};return t.jsxs(t.Fragment,{children:[`${y}`&&t.jsxs(t.Fragment,{children:[t.jsxs("pre",{children:["Search params: ?",`${y}`]}),t.jsx(oe,{})]}),t.jsx(x,{items:D(n,f),columns:e.columns,hasNextPage:(n==null?void 0:n.length)>0&&n.length<30,onFetchNextPage:ne,totalItems:n==null?void 0:n.length,filters:{filters:f,add:ee,remove:ae},topbar:e.topbar,isLoading:e.isLoading,...e.search?{search:{searchInput:C,setSearchInput:te,onSearch:re}}:{},getRowCanExpand:e.getRowCanExpand,renderSubComponent:e.renderSubComponent,...e.isSortable?{sorting:a,onSortChange:P,manualSorting:!1}:{}})]})},l=s.bind({});l.args={columns:r,items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),totalItems:20,isSortable:!1,onFetchNextPage:!0};const m=s.bind({});m.args={columns:r,items:[]};const p=s.bind({});p.args={columns:r,items:[],isLoading:!0};const h=s.bind({});h.args={columns:r,items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const fe={id:"actions",cell:e=>e.actions,label:""},d=s.bind({});d.args={columns:[...r,fe],items:[...Array(8).keys()].map((e,a)=>({label:`Service #${a}`,price:Math.floor(1+Math.random()*100),actions:t.jsx("div",{className:"flex items-center justify-center",children:t.jsx("div",{children:t.jsx(be,{isCompact:!0,variant:ie.ghost,id:a.toString(),items:[{id:1,target:"_blank",label:"Action 1",urn:"urn:v9:eu:resource:manatestkds-fdsfsd",iamActions:["vrackServices:apiovh:iam/resource/update"]},{id:2,target:"_blank",label:"Action 2",urn:"urn:v9:eu:resource:manate",iamActions:["vrackServices:apiovh:iam/resource/delete"]}]})})})})),isSortable:!0};const u=s.bind({});u.args={items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),columns:ge};const g=s.bind({}),Ie=()=>t.jsx(ce,{label:"Add item",icon:le.plus});g.args={items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100),status:`Status #${a}`})),columns:Se,search:{searchInput:"",setSearchInput:()=>{},onSearch:()=>{}},topbar:t.jsx(Ie,{})};const S=s.bind({});S.args={columns:r,items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:e=>t.jsx(he,{children:JSON.stringify(e.original)})};const b=s.bind({});b.args={columns:r,items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:(e,a)=>{const P=r.map(c=>({...c,size:a.current[c.id].clientWidth}));return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
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
    `}),t.jsx(x,{columns:P,items:[{label:"sub component label",price:10},{label:"sub component label #2",price:100}],totalItems:2,hideHeader:!0,tableLayoutFixed:!0})]})}};const He={title:"Components/Datagrid Cursor",component:x,decorators:[me]};var M,N,w;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`args => {
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
    }} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
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
}`,...(w=(N=l.parameters)==null?void 0:N.docs)==null?void 0:w.source}}};var O,$,k;m.parameters={...m.parameters,docs:{...(O=m.parameters)==null?void 0:O.docs,source:{originalSource:`args => {
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
    }} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
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
}`,...(k=($=m.parameters)==null?void 0:$.docs)==null?void 0:k.source}}};var A,E,j;p.parameters={...p.parameters,docs:{...(A=p.parameters)==null?void 0:A.docs,source:{originalSource:`args => {
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
    }} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
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
}`,...(j=(E=p.parameters)==null?void 0:E.docs)==null?void 0:j.source}}};var _,L,R;h.parameters={...h.parameters,docs:{...(_=h.parameters)==null?void 0:_.docs,source:{originalSource:`args => {
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
    }} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
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
}`,...(R=(L=h.parameters)==null?void 0:L.docs)==null?void 0:R.source}}};var T,W,B;d.parameters={...d.parameters,docs:{...(T=d.parameters)==null?void 0:T.docs,source:{originalSource:`args => {
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
    }} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
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
}`,...(B=(W=d.parameters)==null?void 0:W.docs)==null?void 0:B.source}}};var K,z,G;u.parameters={...u.parameters,docs:{...(K=u.parameters)==null?void 0:K.docs,source:{originalSource:`args => {
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
    }} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
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
}`,...(G=(z=u.parameters)==null?void 0:z.docs)==null?void 0:G.source}}};var H,J,U;g.parameters={...g.parameters,docs:{...(H=g.parameters)==null?void 0:H.docs,source:{originalSource:`args => {
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
    }} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
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
}`,...(U=(J=g.parameters)==null?void 0:J.docs)==null?void 0:U.source}}};var V,q,Q;S.parameters={...S.parameters,docs:{...(V=S.parameters)==null?void 0:V.docs,source:{originalSource:`args => {
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
    }} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
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
}`,...(Q=(q=S.parameters)==null?void 0:q.docs)==null?void 0:Q.source}}};var X,Y,Z;b.parameters={...b.parameters,docs:{...(X=b.parameters)==null?void 0:X.docs,source:{originalSource:`args => {
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
    }} topbar={args.topbar} isLoading={args.isLoading} {...args.search ? {
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
}`,...(Z=(Y=b.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};const Je=["Basic","Empty","Loading","Sortable","WithActions","Filters","Topbar","WithSubComponent","WithDatagridSubComponent"];export{l as Basic,m as Empty,u as Filters,p as Loading,h as Sortable,g as Topbar,d as WithActions,b as WithDatagridSubComponent,S as WithSubComponent,Je as __namedExportsOrder,He as default};
