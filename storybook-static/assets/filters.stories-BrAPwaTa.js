import{j as e}from"./jsx-runtime-CKrituN3.js";import{r as g}from"./index-CBqU2yxZ.js";import{c as m,a as n,O as x}from"./index-KJkR1nQ3.js";import{g as v,b as c,e as j}from"./index-v66SXByX.js";import{K as O}from"./index-DgFGY8d_.js";import{F as S,a as h}from"./filter-list.component-BU0r316C.js";import{F as N,a as _}from"./filters-D9DaemX1.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-4N_owrwP.js";import"./useTranslation-Cbsqft5V.js";import"./context-DPnKhrhb.js";import"./i18next-6HYnolD1.js";const p=(s,r)=>s.key===r.key&&s.value===r.value&&s.comparator===r.comparator;function y(){const[s,r]=g.useState([]);return{filters:s,addFilter:o=>{o.value&&r(t=>t.some(a=>p(a,o))?t:[...t,o])},removeFilter:o=>{r(t=>t.filter(a=>!p(a,o)))}}}const C=()=>{const[s,r]=g.useState(""),{filters:o,addFilter:t,removeFilter:a}=y();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex justify-center",children:[e.jsx(v,{name:"ods-input-username",className:"w-[30%] mr-2",value:s,onOdsChange:({detail:l})=>r(l.value)}),e.jsx(c,{label:"",icon:m.magnifyingGlass,className:"mr-5",size:n.sm,onClick:()=>{t({key:"username",value:s,comparator:N.Includes,label:"Username"}),r("")}}),e.jsx("div",{id:"popover-trigger",children:e.jsx(c,{slot:"popover-trigger",size:n.sm,variant:x.outline,icon:m.filter,label:"Filter"})}),e.jsx(j,{triggerId:"popover-trigger","with-arrow":!0,children:e.jsx(S,{columns:[{id:"username",label:"Username",comparators:_.String}],onAddFilter:(l,F)=>{t({...l,label:F.label})}})})]}),e.jsx("div",{className:"my-5",children:e.jsx(h,{filters:o,onRemoveFilter:a})})]})},i={args:{}},K={title:"Components/Filters",component:C,decorators:[O]};var d,u,f;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {}
}`,...(f=(u=i.parameters)==null?void 0:u.docs)==null?void 0:f.source}}};const q=["DefaultProps"];export{i as DefaultProps,q as __namedExportsOrder,K as default};
