import{j as r}from"./jsx-runtime-CKrituN3.js";import{r as c}from"./index-CBqU2yxZ.js";import{K as P,u as k}from"./index-CEIG-fiv.js";import{D as A,a as l}from"./datagrid.component-DlbsJDP4.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-4N_owrwP.js";import"./index-Q-VytQcI.js";import"./index-DWFHwCPM.js";import"./index-BtM5VmRH.js";import"./useTranslation-CvcVFFFk.js";import"./i18next-ihUiNgJT.js";const C=[{id:"label",cell:e=>r.jsx(l,{children:e.label}),label:"Label"},{id:"price",cell:e=>r.jsxs(l,{children:[e.price," €"]}),label:"Price"}],E=({items:e,isSortable:a})=>{const[y,M]=c.useState(),[t,j]=c.useState(e),[m]=k(),_=()=>{const I=t.length,$=[...Array(10).keys()].map((i,D)=>({label:`Item #${D+I}`,price:Math.floor(1+Math.random()*100)}));j(i=>[...i,...$])};return r.jsxs(r.Fragment,{children:[`${m}`&&r.jsxs(r.Fragment,{children:[r.jsxs("pre",{children:["Search params: ?",`${m}`]}),r.jsx("hr",{})]}),r.jsx(A,{columns:C,items:t,totalItems:t.length,hasNextPage:t.length>0&&t.length<30,onFetchNextPage:_,...a?{sorting:y,onSortChange:M,manualSorting:!1}:{}})]})},s={args:{items:[]}},o={args:{items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),isSortable:!1}},n={args:{items:[...Array(10).keys()].map((e,a)=>({label:`Item #${a}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0}},w={title:"Components/Datagrid Cursor",component:E,decorators:[P]};var p,d,h;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...(h=(d=s.parameters)==null?void 0:d.docs)==null?void 0:h.source}}};var g,u,x;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    items: [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i}\`,
      price: Math.floor(1 + Math.random() * 100)
    })),
    isSortable: false
  }
}`,...(x=(u=o.parameters)==null?void 0:u.docs)==null?void 0:x.source}}};var S,b,f;n.parameters={...n.parameters,docs:{...(S=n.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    items: [...Array(10).keys()].map((_, i) => ({
      label: \`Item #\${i}\`,
      price: Math.floor(1 + Math.random() * 100)
    })),
    isSortable: true
  }
}`,...(f=(b=n.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};const z=["Empty","Basic","Sortable"];export{o as Basic,s as Empty,n as Sortable,z as __namedExportsOrder,w as default};
//# sourceMappingURL=datagrid-cursor.stories-BErTvyGh.js.map
