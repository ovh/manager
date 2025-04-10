import{j as r}from"./jsx-runtime-CKrituN3.js";import{u as O,K as W}from"./index-lGtsexrg.js";import{P as u,b as U,D as T,a as Z}from"./datagrid.component-BWwsgqBg.js";import{u as q,a as H}from"./useColumnFilters-RgZVa838.js";import{c as m,a as Q}from"./datagrid.mock-DBM7kmk8.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BkDLP3dD.js";import"./index-CqmMgYso.js";import"./index-BoGQ30sD.js";import"./index-BtM5VmRH.js";import"./clsx-B-dksMZM.js";import"./useTranslation-pmbu4BU3.js";import"./i18next-ihUiNgJT.js";const C=e=>Object.fromEntries([...e.entries()]),V=e=>{const n={...U};if(e.has("page")){let a=parseInt(e.get("page"),10)-1;(Number.isNaN(a)||a<0)&&(a=0),n.pageIndex=a}if(e.has("pageSize")){let a=parseInt(e.get("pageSize"),10);u.includes(a)||([a]=u),n.pageSize=a}return n},Y=(e,n)=>{const a={id:null,desc:!1};if(e.has("sort"))a.id=e.get("sort"),e.has("sortOrder")&&(a.desc=e.get("sortOrder")==="desc");else if(n)return n;return a},nn=e=>{const[n,a]=O();return{pagination:V(n),sorting:Y(n,e),setPagination:({pageIndex:t,pageSize:s})=>{t>0?n.set("page",`${t+1}`):n.delete("page"),u.includes(s)&&s!==u[0]?n.set("pageSize",`${s}`):n.delete("pageSize"),a({...C(n)})},setSorting:({id:t,desc:s})=>{t?(n.set("sort",t),s?n.set("sortOrder","desc"):n.delete("sortOrder")):(n.delete("sort"),n.delete("sortOrder")),a({...C(n)})}}};function en(e,n){if(!n)return e;const a=n.desc?-1:1;return n.id==="label"?e.sort((t,s)=>a*t.label.localeCompare(s.label)):n.id==="price"?e.sort((t,s)=>a*(t.price-s.price)):e}const c=({items:e,isPaginated:n,isSortable:a,isLoading:t=!1,columns:s=m,getRowCanExpand:_,renderSubComponent:M})=>{const[S]=O(),{pagination:p,setPagination:J,sorting:h,setSorting:N}=nn({id:"validityTo",desc:!1}),P=n?p.pageIndex*p.pageSize:0,X=n?P+p.pageSize:e.length,k=n&&{pagination:p,onPaginationChange:J},G=a&&{sorting:h,onSortChange:N},{filters:b,addFilter:B,removeFilter:K}=q();return r.jsxs(r.Fragment,{children:[`${S}`&&r.jsxs(r.Fragment,{children:[r.jsxs("pre",{children:["Search params: ?",`${S}`]}),r.jsx("hr",{})]}),r.jsx(T,{columns:s,items:H(en(e,h).slice(P,X),b),totalItems:e.length,isLoading:t,...k,...G,filters:{filters:b,add:B,remove:K},getRowCanExpand:_,renderSubComponent:M})]})},o=c.bind({});o.args={columns:m,items:[...Array(50).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0};const i=c.bind({});i.args={columns:m,items:[],isLoading:!0};const g=c.bind({});g.args={columns:m,items:[...Array(8).keys()].map((e,n)=>({label:`Service #${n}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const l=c.bind({});l.args={items:[...Array(50).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0,columns:Q};const d=c.bind({});d.args={columns:m,items:[...Array(10).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:e=>r.jsx(Z,{children:JSON.stringify(e.original)})};const Pn={title:"Components/Datagrid Paginated",component:T,decorators:[W],parameters:{status:{type:"deprecated"},docs:{description:{component:"The `Datagrid` component in pagination mode is now `deprecated`. Please switch to the cursor navigation mode"}}}};var f,F,x;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  isLoading = false,
  columns = clm,
  getRowCanExpand,
  renderSubComponent
}: {
  items: Item[];
  isLoading: boolean;
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
  renderSubComponent?: (props: Row<any>) => JSX.Element;
  getRowCanExpand?: (row: Row<any>) => boolean;
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
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} isLoading={isLoading} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} getRowCanExpand={getRowCanExpand} renderSubComponent={renderSubComponent} />
    </>;
}`,...(x=(F=o.parameters)==null?void 0:F.docs)==null?void 0:x.source}}};var w,y,E;i.parameters={...i.parameters,docs:{...(w=i.parameters)==null?void 0:w.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  isLoading = false,
  columns = clm,
  getRowCanExpand,
  renderSubComponent
}: {
  items: Item[];
  isLoading: boolean;
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
  renderSubComponent?: (props: Row<any>) => JSX.Element;
  getRowCanExpand?: (row: Row<any>) => boolean;
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
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} isLoading={isLoading} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} getRowCanExpand={getRowCanExpand} renderSubComponent={renderSubComponent} />
    </>;
}`,...(E=(y=i.parameters)==null?void 0:y.docs)==null?void 0:E.source}}};var I,R,A;g.parameters={...g.parameters,docs:{...(I=g.parameters)==null?void 0:I.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  isLoading = false,
  columns = clm,
  getRowCanExpand,
  renderSubComponent
}: {
  items: Item[];
  isLoading: boolean;
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
  renderSubComponent?: (props: Row<any>) => JSX.Element;
  getRowCanExpand?: (row: Row<any>) => boolean;
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
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} isLoading={isLoading} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} getRowCanExpand={getRowCanExpand} renderSubComponent={renderSubComponent} />
    </>;
}`,...(A=(R=g.parameters)==null?void 0:R.docs)==null?void 0:A.source}}};var v,L,D;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  isLoading = false,
  columns = clm,
  getRowCanExpand,
  renderSubComponent
}: {
  items: Item[];
  isLoading: boolean;
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
  renderSubComponent?: (props: Row<any>) => JSX.Element;
  getRowCanExpand?: (row: Row<any>) => boolean;
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
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} isLoading={isLoading} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} getRowCanExpand={getRowCanExpand} renderSubComponent={renderSubComponent} />
    </>;
}`,...(D=(L=l.parameters)==null?void 0:L.docs)==null?void 0:D.source}}};var $,z,j;d.parameters={...d.parameters,docs:{...($=d.parameters)==null?void 0:$.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  isLoading = false,
  columns = clm,
  getRowCanExpand,
  renderSubComponent
}: {
  items: Item[];
  isLoading: boolean;
  isPaginated: boolean;
  isSortable: boolean;
  columns?: any;
  renderSubComponent?: (props: Row<any>) => JSX.Element;
  getRowCanExpand?: (row: Row<any>) => boolean;
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
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} isLoading={isLoading} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} getRowCanExpand={getRowCanExpand} renderSubComponent={renderSubComponent} />
    </>;
}`,...(j=(z=d.parameters)==null?void 0:z.docs)==null?void 0:j.source}}};const bn=["Basic","Loading","Sortable","Filters","WithSubComponent"];export{o as Basic,l as Filters,i as Loading,g as Sortable,d as WithSubComponent,bn as __namedExportsOrder,Pn as default};
