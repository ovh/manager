import{j as r}from"./jsx-runtime-CKrituN3.js";import{u as C,K as M}from"./index-DgFGY8d_.js";import{P as g,b as N,D}from"./datagrid.component-DA5SKJUz.js";import{u as k,d as w}from"./useColumnFilters-D8p1natW.js";import{c as m,a as B}from"./datagrid.mock-B1tjJTvz.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-4N_owrwP.js";import"./index-Cs_lFblA.js";import"./index-D2Jq8zTl.js";import"./index-BtM5VmRH.js";import"./useTranslation-pmbu4BU3.js";import"./i18next-ihUiNgJT.js";const S=n=>Object.fromEntries([...n.entries()]),G=n=>{const e={...N};if(n.has("page")){let t=parseInt(n.get("page"),10)-1;(Number.isNaN(t)||t<0)&&(t=0),e.pageIndex=t}if(n.has("pageSize")){let t=parseInt(n.get("pageSize"),10);g.includes(t)||([t]=g),e.pageSize=t}return e},K=(n,e)=>{const t={id:null,desc:!1};if(n.has("sort"))t.id=n.get("sort"),n.has("sortOrder")&&(t.desc=n.get("sortOrder")==="desc");else if(e)return e;return t},R=n=>{const[e,t]=C();return{pagination:G(e),sorting:K(e,n),setPagination:({pageIndex:s,pageSize:a})=>{s>0?e.set("page",`${s+1}`):e.delete("page"),g.includes(a)&&a!==g[0]?e.set("pageSize",`${a}`):e.delete("pageSize"),t({...S(e)})},setSorting:({id:s,desc:a})=>{s?(e.set("sort",s),a?e.set("sortOrder","desc"):e.delete("sortOrder")):(e.delete("sort"),e.delete("sortOrder")),t({...S(e)})}}};function U(n,e){if(!e)return n;const t=e.desc?-1:1;return e.id==="label"?n.sort((s,a)=>t*s.label.localeCompare(a.label)):e.id==="price"?n.sort((s,a)=>t*(s.price-a.price)):n}const d=({items:n,isPaginated:e,isSortable:t,columns:s=m})=>{const[a]=C(),{pagination:c,setPagination:$,sorting:p,setSorting:z}=R({id:"validityTo",desc:!1}),u=e?c.pageIndex*c.pageSize:0,j=e?u+c.pageSize:n.length,O=e&&{pagination:c,onPaginationChange:$},_=t&&{sorting:p,onSortChange:z},{filters:h,addFilter:T,removeFilter:E}=k();return r.jsxs(r.Fragment,{children:[`${a}`&&r.jsxs(r.Fragment,{children:[r.jsxs("pre",{children:["Search params: ?",`${a}`]}),r.jsx("hr",{})]}),r.jsx(D,{columns:s,items:w(U(n,p).slice(u,j),h),totalItems:n.length,...O,..._,filters:{filters:h,add:T,remove:E}})]})},i=d.bind({});i.args={columns:m,items:[...Array(50).keys()].map((n,e)=>({label:`Item #${e}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0};const o=d.bind({});o.args={columns:m,items:[...Array(8).keys()].map((n,e)=>({label:`Service #${e}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const l=d.bind({});l.args={items:[...Array(50).keys()].map((n,e)=>({label:`Item #${e}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0,columns:B};const ae={title:"Components/Datagrid Paginated",component:D,decorators:[M],parameters:{status:{type:"deprecated"},docs:{description:{component:"The `Datagrid` component in pagination mode is now `deprecated`. Please switch to the cursor navigation mode"}}}};var P,f,b;i.parameters={...i.parameters,docs:{...(P=i.parameters)==null?void 0:P.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  columns = clm
}: {
  items: Item[];
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
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
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <hr />
        </>}
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} />
    </>;
}`,...(b=(f=i.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var F,I,A;o.parameters={...o.parameters,docs:{...(F=o.parameters)==null?void 0:F.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  columns = clm
}: {
  items: Item[];
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
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
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <hr />
        </>}
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} />
    </>;
}`,...(A=(I=o.parameters)==null?void 0:I.docs)==null?void 0:A.source}}};var y,v,x;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  columns = clm
}: {
  items: Item[];
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
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
  const {
    filters,
    addFilter,
    removeFilter
  } = useColumnFilters();
  return <>
      {\`\${searchParams}\` && <>
          <pre>Search params: ?{\`\${searchParams}\`}</pre>
          <hr />
        </>}
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} />
    </>;
}`,...(x=(v=l.parameters)==null?void 0:v.docs)==null?void 0:x.source}}};const se=["Basic","Sortable","Filters"];export{i as Basic,l as Filters,o as Sortable,se as __namedExportsOrder,ae as default};
