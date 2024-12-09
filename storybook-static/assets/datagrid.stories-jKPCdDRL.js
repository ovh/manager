import{j as r}from"./jsx-runtime-CKrituN3.js";import{u as I,K as C}from"./index-CEIG-fiv.js";import{D as x,a as p}from"./datagrid.component-CW6kKrFD.js";import{P as c,D as O}from"./datagrid.contants-DE5a_Gky.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-4N_owrwP.js";import"./index-C-Nbf5H5.js";import"./index-v66SXByX.js";import"./index-BtM5VmRH.js";import"./useTranslation-CvcVFFFk.js";import"./i18next-ihUiNgJT.js";const m=t=>Object.fromEntries([...t.entries()]),T=t=>{const e={...O};if(t.has("page")){let n=parseInt(t.get("page"),10)-1;(Number.isNaN(n)||n<0)&&(n=0),e.pageIndex=n}if(t.has("pageSize")){let n=parseInt(t.get("pageSize"),10);c.includes(n)||([n]=c),e.pageSize=n}return e},_=(t,e)=>{const n={id:null,desc:!1};if(t.has("sort"))n.id=t.get("sort"),t.has("sortOrder")&&(n.desc=t.get("sortOrder")==="desc");else if(e)return e;return n},E=t=>{const[e,n]=I();return{pagination:T(e),sorting:_(e,t),setPagination:({pageIndex:s,pageSize:a})=>{s>0?e.set("page",`${s+1}`):e.delete("page"),c.includes(a)&&a!==c[0]?e.set("pageSize",`${a}`):e.delete("pageSize"),n({...m(e)})},setSorting:({id:s,desc:a})=>{s?(e.set("sort",s),a?e.set("sortOrder","desc"):e.delete("sortOrder")):(e.delete("sort"),e.delete("sortOrder")),n({...m(e)})}}},g=[{id:"label",cell:t=>r.jsx(p,{children:t.label}),label:"Label"},{id:"price",cell:t=>r.jsxs(p,{children:[t.price," €"]}),label:"Price"}];function v(t,e){if(!e)return t;const n=e.desc?-1:1;return e.id==="label"?t.sort((s,a)=>n*s.label.localeCompare(a.label)):e.id==="price"?t.sort((s,a)=>n*(s.price-a.price)):t}const A=({items:t,isPaginated:e,isSortable:n})=>{const[s]=I(),{pagination:a,setPagination:D,sorting:l,setSorting:j}=E({id:"validityTo",desc:!1}),d=e?a.pageIndex*a.pageSize:0,z=e?d+a.pageSize:t.length,$=e&&{pagination:a,onPaginationChange:D},y=n&&{sorting:l,onSortChange:j};return r.jsxs(r.Fragment,{children:[`${s}`&&r.jsxs(r.Fragment,{children:[r.jsxs("pre",{children:["Search params: ?",`${s}`]}),r.jsx("hr",{})]}),r.jsx(x,{columns:g,items:v(t,l).slice(d,z),totalItems:t.length,...$,...y})]})},i=A.bind({});i.args={columns:g,items:[...Array(50).keys()].map((t,e)=>({label:`Item #${e}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0};const o=A.bind({});o.args={columns:g,items:[...Array(8).keys()].map((t,e)=>({label:`Service #${e}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const H={title:"Components/Datagrid Paginated",component:x,decorators:[C],parameters:{status:{type:"deprecated"},docs:{description:{component:"The `Datagrid` component in pagination mode is now `deprecated`. Please switch to the cursor navigation mode"}}}};var h,S,u;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable
}: {
  items: Item[];
  isPaginated: boolean;
  isSortable: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const {
    pagination,
    setPagination,
    sorting,
    setSorting
  } = useDatagridSearchParams({
    id: 'validityTo',
    desc: false
  });
  const start = isPaginated ? pagination.pageIndex * pagination.pageSize : 0;
  const end = isPaginated ? start + pagination.pageSize : items.length;
  const paginationAttrs = isPaginated && {
    pagination,
    onPaginationChange: setPagination
  };
  const sortingAttrs = isSortable && {
    sorting,
    onSortChange: setSorting
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <hr />
        </>}
      <Datagrid columns={columns} items={sortItems(items, sorting).slice(start, end)} totalItems={items.length} {...paginationAttrs} {...sortingAttrs} />
    </>;
}`,...(u=(S=i.parameters)==null?void 0:S.docs)==null?void 0:u.source}}};var P,b,f;o.parameters={...o.parameters,docs:{...(P=o.parameters)==null?void 0:P.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable
}: {
  items: Item[];
  isPaginated: boolean;
  isSortable: boolean;
}) => {
  const [searchParams] = useSearchParams();
  const {
    pagination,
    setPagination,
    sorting,
    setSorting
  } = useDatagridSearchParams({
    id: 'validityTo',
    desc: false
  });
  const start = isPaginated ? pagination.pageIndex * pagination.pageSize : 0;
  const end = isPaginated ? start + pagination.pageSize : items.length;
  const paginationAttrs = isPaginated && {
    pagination,
    onPaginationChange: setPagination
  };
  const sortingAttrs = isSortable && {
    sorting,
    onSortChange: setSorting
  };
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <hr />
        </>}
      <Datagrid columns={columns} items={sortItems(items, sorting).slice(start, end)} totalItems={items.length} {...paginationAttrs} {...sortingAttrs} />
    </>;
}`,...(f=(b=o.parameters)==null?void 0:b.docs)==null?void 0:f.source}}};const J=["Basic","Sortable"];export{i as Basic,o as Sortable,J as __namedExportsOrder,H as default};
