import{j as e}from"./jsx-runtime-CKrituN3.js";import{r as x}from"./index-CBqU2yxZ.js";import{a as i,b as l,O as F}from"./index-Cs_lFblA.js";import{c as f,d as m,e as j}from"./index-D2Jq8zTl.js";import{K as v}from"./index-DgFGY8d_.js";import{u as O,a as h,b as N,F as S,c as _}from"./useColumnFilters-CFW73QpZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-4N_owrwP.js";import"./useTranslation-CvcVFFFk.js";import"./i18next-ihUiNgJT.js";const b=()=>{const[t,a]=x.useState(""),{filters:d,addFilter:o,removeFilter:u}=O();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex justify-center",children:[e.jsx(f,{name:"ods-input-username",className:"w-[30%] mr-2",value:t,onOdsChange:({detail:s})=>a(s.value)}),e.jsx(m,{label:"",icon:i.magnifyingGlass,className:"mr-5",size:l.sm,onClick:()=>{o({key:"username",value:t,comparator:h.Includes,label:"Username"}),a("")}}),e.jsx("div",{id:"popover-trigger",children:e.jsx(m,{slot:"popover-trigger",size:l.sm,variant:F.outline,icon:i.filter,label:"Filter"})}),e.jsx(j,{triggerId:"popover-trigger","with-arrow":!0,children:e.jsx(N,{columns:[{id:"username",label:"Username",comparators:S.String}],onAddFilter:(s,g)=>{o({...s,label:g.label})}})})]}),e.jsx("div",{className:"my-5",children:e.jsx(_,{filters:d,onRemoveFilter:u})})]})},r={args:{}},R={title:"Components/Filters",component:b,decorators:[v]};var n,c,p;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {}
}`,...(p=(c=r.parameters)==null?void 0:c.docs)==null?void 0:p.source}}};const k=["DefaultProps"];export{r as DefaultProps,k as __namedExportsOrder,R as default};
