import{j as o}from"./jsx-runtime-CKrituN3.js";import{u as $,K as C}from"./index-CEIG-fiv.js";import{D as N,a as g}from"./datagrid.component-B0Nmw36l.js";import{P as m,D as T}from"./datagrid.contants-DE5a_Gky.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-4N_owrwP.js";import"./index-obPKuldP.js";import"./index-DP43DFaX.js";import"./index-BtM5VmRH.js";import"./useTranslation-CvcVFFFk.js";import"./i18next-ihUiNgJT.js";const u=r=>Object.fromEntries([...r.entries()]),F=r=>{const e={...T};if(r.has("page")){let a=parseInt(r.get("page"),10)-1;(Number.isNaN(a)||a<0)&&(a=0),e.pageIndex=a}if(r.has("pageSize")){let a=parseInt(r.get("pageSize"),10);m.includes(a)||([a]=m),e.pageSize=a}return e},G=(r,e)=>{const a={id:null,desc:!1};if(r.has("sort"))a.id=r.get("sort"),r.has("sortOrder")&&(a.desc=r.get("sortOrder")==="desc");else if(e)return e;return a},B=r=>{const[e,a]=$();return{pagination:F(e),sorting:G(e,r),setPagination:({pageIndex:s,pageSize:t})=>{s>0?e.set("page",`${s+1}`):e.delete("page"),m.includes(t)&&t!==m[0]?e.set("pageSize",`${t}`):e.delete("pageSize"),a({...u(e)})},setSorting:({id:s,desc:t})=>{s?(e.set("sort",s),t?e.set("sortOrder","desc"):e.delete("sortOrder")):(e.delete("sort"),e.delete("sortOrder")),a({...u(e)})}}},K=[{id:"label",cell:r=>o.jsx(g,{children:r.label}),label:"Label"},{id:"price",cell:r=>o.jsxs(g,{children:[r.price," €"]}),label:"Price"}];function v(r,e){if(!e)return r;const a=e.desc?-1:1;return e.id==="label"?r.sort((s,t)=>a*s.label.localeCompare(t.label)):e.id==="price"?r.sort((s,t)=>a*(s.price-t.price)):r}const R=({items:r,isPaginated:e,isSortable:a})=>{const[s]=$(),{pagination:t,setPagination:O,sorting:p,setSorting:D}=B({id:"validityTo",desc:!1}),d=e?t.pageIndex*t.pageSize:0,E=e?d+t.pageSize:r.length,k=e&&{pagination:t,onPaginationChange:O},z=a&&{sorting:p,onSortChange:D};return o.jsxs(o.Fragment,{children:[`${s}`&&o.jsxs(o.Fragment,{children:[o.jsxs("pre",{children:["Search params: ?",`${s}`]}),o.jsx("hr",{})]}),o.jsx(N,{columns:K,items:v(r,p).slice(d,E),totalItems:r.length,...k,...z})]})},n={args:{items:[]}},i={args:{items:[...Array(15).keys()].map((r,e)=>({label:`Item #${e}`,price:Math.floor(1+Math.random()*100)}))}},c={args:{items:[...Array(15).keys()].map((r,e)=>({label:`Item #${e}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0}},l={args:{items:[...Array(50).keys()].map((r,e)=>({label:`Item #${e}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0}},ee={title:"Components/Datagrid Paginated",component:R,decorators:[C]};var h,f,S;n.parameters={...n.parameters,docs:{...(h=n.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...(S=(f=n.parameters)==null?void 0:f.docs)==null?void 0:S.source}}};var b,P,y;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    items: [...Array(15).keys()].map((_, i) => ({
      label: \`Item #\${i}\`,
      price: Math.floor(1 + Math.random() * 100)
    }))
  }
}`,...(y=(P=i.parameters)==null?void 0:P.docs)==null?void 0:y.source}}};var I,x,A;c.parameters={...c.parameters,docs:{...(I=c.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    items: [...Array(15).keys()].map((_, i) => ({
      label: \`Item #\${i}\`,
      price: Math.floor(1 + Math.random() * 100)
    })),
    isSortable: true
  }
}`,...(A=(x=c.parameters)==null?void 0:x.docs)==null?void 0:A.source}}};var M,j,_;l.parameters={...l.parameters,docs:{...(M=l.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    items: [...Array(50).keys()].map((_, i) => ({
      label: \`Item #\${i}\`,
      price: Math.floor(1 + Math.random() * 100)
    })),
    isPaginated: true,
    isSortable: true
  }
}`,...(_=(j=l.parameters)==null?void 0:j.docs)==null?void 0:_.source}}};const re=["Empty","Basic","Sortable","Pagination"];export{i as Basic,n as Empty,l as Pagination,c as Sortable,re as __namedExportsOrder,ee as default};
//# sourceMappingURL=datagrid.stories-dA0WTQBz.js.map
