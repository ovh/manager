import{j as a}from"./jsx-runtime-CKrituN3.js";import{r as u}from"./index-CBqU2yxZ.js";import{b as R}from"./index-D2Jq8zTl.js";import{O as W}from"./index-Cs_lFblA.js";import{K as U,u as V}from"./index-DgFGY8d_.js";import{D as M}from"./datagrid.component-DA5SKJUz.js";import{u as q}from"./useColumnFilters-D8p1natW.js";import{c as l,a as w}from"./datagrid.mock-B1tjJTvz.js";import"./card.component-CBFDsZDR.js";import{A as z}from"./action.component-CiKddiuI.js";import"./guide.component-BaV3cDBZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-4N_owrwP.js";import"./useTranslation-pmbu4BU3.js";import"./i18next-ihUiNgJT.js";import"./title.component-Bx3BQPQH.js";import"./links.component-DUo1K6KO.js";import"./translation-CBNwEvwd.js";import"./ManagerButton-BDe_LZgY.js";import"./useOvhIam-puHWDhg2.js";import"./QueryClientProvider-DWOoNJcY.js";const c=r=>{const[t,A]=u.useState(),[e,_]=u.useState(r.items),[d]=V(),{filters:k,addFilter:j,removeFilter:O}=q(),E=()=>{const B=e==null?void 0:e.length,T=[...Array(10).keys()].map((g,K)=>({label:`Item #${K+B}`,price:Math.floor(1+Math.random()*100)}));_(g=>[...g,...T])};return a.jsxs(a.Fragment,{children:[`${d}`&&a.jsxs(a.Fragment,{children:[a.jsxs("pre",{children:["Search params: ?",`${d}`]}),a.jsx(R,{})]}),a.jsx(M,{items:e,columns:r.columns,hasNextPage:(e==null?void 0:e.length)>0&&e.length<30,onFetchNextPage:E,totalItems:e==null?void 0:e.length,filters:{filters:k,add:j,remove:O},...r.isSortable?{sorting:t,onSortChange:A,manualSorting:!1}:{}})]})},s=c.bind({});s.args={columns:l,items:[...Array(10).keys()].map((r,t)=>({label:`Item #${t}`,price:Math.floor(1+Math.random()*100)})),totalItems:20,isSortable:!1,onFetchNextPage:!0};const n=c.bind({});n.args={columns:l,items:[]};const o=c.bind({});o.args={columns:l,items:[...Array(10).keys()].map((r,t)=>({label:`Item #${t}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const G={id:"actions",cell:r=>r.actions,label:""},i=c.bind({});i.args={columns:[...l,G],items:[...Array(8).keys()].map((r,t)=>({label:`Service #${t}`,price:Math.floor(1+Math.random()*100),actions:a.jsx("div",{className:"flex items-center justify-center",children:a.jsx("div",{children:a.jsx(z,{isCompact:!0,variant:W.ghost,id:t.toString(),items:[{id:1,target:"_blank",label:"Action 1",urn:"urn:v9:eu:resource:manatestkds-fdsfsd",iamActions:["vrackServices:apiovh:iam/resource/update"]},{id:2,target:"_blank",label:"Action 2",urn:"urn:v9:eu:resource:manate",iamActions:["vrackServices:apiovh:iam/resource/delete"]}]})})})})),isSortable:!0};const m=c.bind({});m.args={items:[...Array(10).keys()].map((r,t)=>({label:`Item #${t}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0,columns:w};const pe={title:"Components/Datagrid Cursor",component:M,decorators:[U]};var h,p,S;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={data} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} />
    </>;
}`,...(S=(p=s.parameters)==null?void 0:p.docs)==null?void 0:S.source}}};var f,P,x;n.parameters={...n.parameters,docs:{...(f=n.parameters)==null?void 0:f.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={data} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} />
    </>;
}`,...(x=(P=n.parameters)==null?void 0:P.docs)==null?void 0:x.source}}};var v,F,b;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={data} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} />
    </>;
}`,...(b=(F=o.parameters)==null?void 0:F.docs)==null?void 0:b.source}}};var y,I,D;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={data} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} />
    </>;
}`,...(D=(I=i.parameters)==null?void 0:I.docs)==null?void 0:D.source}}};var N,C,$;m.parameters={...m.parameters,docs:{...(N=m.parameters)==null?void 0:N.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <OdsDivider />
        </>}
      <Datagrid items={data} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} {...args.isSortable ? {
      sorting,
      onSortChange: setSorting,
      manualSorting: false
    } : {}} />
    </>;
}`,...($=(C=m.parameters)==null?void 0:C.docs)==null?void 0:$.source}}};const Se=["Basic","Empty","Sortable","WithActions","Filters"];export{s as Basic,n as Empty,m as Filters,o as Sortable,i as WithActions,Se as __namedExportsOrder,pe as default};
