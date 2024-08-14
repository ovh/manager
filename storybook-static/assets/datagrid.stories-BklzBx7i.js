import{j as o}from"./jsx-runtime-CKrituN3.js";import{u as $,K as C}from"./index-D_zcRJrJ.js";import{D as N,a as g}from"./datagrid.component-DIcYuP3T.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./ods-theme-typography-size-DKhhZ49-.js";import"./index-Csze6KrO.js";import"./index-BtM5VmRH.js";import"./index-_e9w_WTM.js";import"./useTranslation-BaRBqxpK.js";import"./i18next-BjY3x9oy.js";const n=[10,25,50,100,300],T={pageIndex:0,pageSize:n[0]},u=r=>Object.fromEntries([...r.entries()]),F=r=>{const e={...T};if(r.has("page")){let t=parseInt(r.get("page"),10)-1;(Number.isNaN(t)||t<0)&&(t=0),e.pageIndex=t}if(r.has("pageSize")){let t=parseInt(r.get("pageSize"),10);n.includes(t)||([t]=n),e.pageSize=t}return e},G=(r,e)=>{const t={id:null,desc:!1};if(r.has("sort"))t.id=r.get("sort"),r.has("sortOrder")&&(t.desc=r.get("sortOrder")==="desc");else if(e)return e;return t},B=r=>{const[e,t]=$();return{pagination:F(e),sorting:G(e,r),setPagination:({pageIndex:s,pageSize:a})=>{s>0?e.set("page",`${s+1}`):e.delete("page"),n.includes(a)&&a!==n[0]?e.set("pageSize",`${a}`):e.delete("pageSize"),t({...u(e)})},setSorting:({id:s,desc:a})=>{s?(e.set("sort",s),a?e.set("sortOrder","desc"):e.delete("sortOrder")):(e.delete("sort"),e.delete("sortOrder")),t({...u(e)})}}},K=[{id:"label",cell:r=>o.jsx(g,{children:r.label}),label:"Label"},{id:"price",cell:r=>o.jsxs(g,{children:[r.price," €"]}),label:"Price"}];function v(r,e){if(!e)return r;const t=e.desc?-1:1;return e.id==="label"?r.sort((s,a)=>t*s.label.localeCompare(a.label)):e.id==="price"?r.sort((s,a)=>t*(s.price-a.price)):r}const R=({items:r,isPaginated:e,isSortable:t})=>{const[s]=$(),{pagination:a,setPagination:O,sorting:m,setSorting:E}=B({id:"validityTo",desc:!1}),d=e?a.pageIndex*a.pageSize:0,z=e?d+a.pageSize:r.length,D=e&&{pagination:a,onPaginationChange:O},k=t&&{sorting:m,onSortChange:E};return o.jsxs(o.Fragment,{children:[`${s}`&&o.jsxs(o.Fragment,{children:[o.jsxs("pre",{children:["Search params: ?",`${s}`]}),o.jsx("hr",{})]}),o.jsx(N,{columns:K,items:v(r,m).slice(d,z),totalItems:r.length,...D,...k})]})},i={args:{items:[]}},c={args:{items:[...Array(15).keys()].map((r,e)=>({label:`Item #${e}`,price:Math.floor(1+Math.random()*100)}))}},l={args:{items:[...Array(15).keys()].map((r,e)=>({label:`Item #${e}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0}},p={args:{items:[...Array(50).keys()].map((r,e)=>({label:`Item #${e}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0}},L={title:"Components/Datagrid Paginated",component:R,decorators:[C]};var h,S,f;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    items: []
  }
}`,...(f=(S=i.parameters)==null?void 0:S.docs)==null?void 0:f.source}}};var b,y,I;c.parameters={...c.parameters,docs:{...(b=c.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    items: [...Array(15).keys()].map((_, i) => ({
      label: \`Item #\${i}\`,
      price: Math.floor(1 + Math.random() * 100)
    }))
  }
}`,...(I=(y=c.parameters)==null?void 0:y.docs)==null?void 0:I.source}}};var P,x,A;l.parameters={...l.parameters,docs:{...(P=l.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    items: [...Array(15).keys()].map((_, i) => ({
      label: \`Item #\${i}\`,
      price: Math.floor(1 + Math.random() * 100)
    })),
    isSortable: true
  }
}`,...(A=(x=l.parameters)==null?void 0:x.docs)==null?void 0:A.source}}};var M,j,_;p.parameters={...p.parameters,docs:{...(M=p.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    items: [...Array(50).keys()].map((_, i) => ({
      label: \`Item #\${i}\`,
      price: Math.floor(1 + Math.random() * 100)
    })),
    isPaginated: true,
    isSortable: true
  }
}`,...(_=(j=p.parameters)==null?void 0:j.docs)==null?void 0:_.source}}};const ee=["Empty","Basic","Sortable","Pagination"];export{c as Basic,i as Empty,p as Pagination,l as Sortable,ee as __namedExportsOrder,L as default};
//# sourceMappingURL=datagrid.stories-BklzBx7i.js.map
