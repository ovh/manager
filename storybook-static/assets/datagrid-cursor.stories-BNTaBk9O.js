import{j as r}from"./jsx-runtime-CKrituN3.js";import{r as g}from"./index-CBqU2yxZ.js";import{O as $}from"./index-KJkR1nQ3.js";import{K as F}from"./index-DgFGY8d_.js";import{D,a as p}from"./datagrid.component-DO4MRWS9.js";import"./card.component-DWJCpXBY.js";import{A as E}from"./action.component-SgdxLXG2.js";import"./guide.component-CjPMspe6.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-4N_owrwP.js";import"./index-v66SXByX.js";import"./index-BtM5VmRH.js";import"./useTranslation-Cbsqft5V.js";import"./context-DPnKhrhb.js";import"./i18next-6HYnolD1.js";import"./title.component-Bx3BQPQH.js";import"./links.component-DFt-fbY5.js";import"./translation-CW5Eo54I.js";import"./ManagerButton-CL8ziDJD.js";import"./useOvhIam-D508DiNg.js";import"./QueryClientProvider-CDvRjfR1.js";const m=[{id:"label",cell:t=>r.jsx(p,{children:t.label}),label:"Label"},{id:"price",cell:t=>r.jsxs(p,{children:[t.price," €"]}),label:"Price"}],c=t=>{const[a,A]=g.useState(),[e,M]=g.useState(t.items),C=()=>{const _=e==null?void 0:e.length,k=[...Array(10).keys()].map((l,j)=>({label:`Item #${j+_}`,price:Math.floor(1+Math.random()*100)}));M(l=>[...l,...k])};return r.jsx(D,{items:e,columns:t.columns,hasNextPage:(e==null?void 0:e.length)>0&&e.length<30,onFetchNextPage:C,totalItems:e==null?void 0:e.length,...t.isSortable?{sorting:a,onSortChange:A,manualSorting:!1}:{}})},s=c.bind({});s.args={columns:m,items:[...Array(10).keys()].map((t,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),totalItems:20,isSortable:!1,onFetchNextPage:!0};const n=c.bind({});n.args={columns:m,items:[]};const o=c.bind({});o.args={columns:m,items:[...Array(10).keys()].map((t,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const O={id:"actions",cell:t=>t.actions,label:""},i=c.bind({});i.args={columns:[...m,O],items:[...Array(8).keys()].map((t,a)=>({label:`Service #${a}`,price:Math.floor(1+Math.random()*100),actions:r.jsx("div",{className:"flex items-center justify-center",children:r.jsx("div",{children:r.jsx(E,{isCompact:!0,variant:$.ghost,id:a.toString(),items:[{id:1,target:"_blank",label:"Action 1",urn:"urn:v9:eu:resource:manatestkds-fdsfsd",iamActions:["vrackServices:apiovh:iam/resource/update"]},{id:2,target:"_blank",label:"Action 2",urn:"urn:v9:eu:resource:manate",iamActions:["vrackServices:apiovh:iam/resource/delete"]}]})})})})),isSortable:!0};const rt={title:"Components/Datagrid Cursor",component:D,decorators:[F]};var d,u,h;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  return <Datagrid items={data} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} {...args.isSortable ? {
    sorting,
    onSortChange: setSorting,
    manualSorting: false
  } : {}} />;
}`,...(h=(u=s.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var S,x,f;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  return <Datagrid items={data} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} {...args.isSortable ? {
    sorting,
    onSortChange: setSorting,
    manualSorting: false
  } : {}} />;
}`,...(f=(x=n.parameters)==null?void 0:x.docs)==null?void 0:f.source}}};var b,P,y;o.parameters={...o.parameters,docs:{...(b=o.parameters)==null?void 0:b.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  return <Datagrid items={data} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} {...args.isSortable ? {
    sorting,
    onSortChange: setSorting,
    manualSorting: false
  } : {}} />;
}`,...(y=(P=o.parameters)==null?void 0:P.docs)==null?void 0:y.source}}};var I,N,v;i.parameters={...i.parameters,docs:{...(I=i.parameters)==null?void 0:I.docs,source:{originalSource:`args => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i + itemsIndex}\`,
      price: Math.floor(1 + Math.random() * 100)
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };
  return <Datagrid items={data} columns={args.columns} hasNextPage={data?.length > 0 && data.length < 30} onFetchNextPage={fetchNextPage} totalItems={data?.length} {...args.isSortable ? {
    sorting,
    onSortChange: setSorting,
    manualSorting: false
  } : {}} />;
}`,...(v=(N=i.parameters)==null?void 0:N.docs)==null?void 0:v.source}}};const st=["Basic","Empty","Sortable","WithActions"];export{s as Basic,n as Empty,o as Sortable,i as WithActions,st as __namedExportsOrder,rt as default};
