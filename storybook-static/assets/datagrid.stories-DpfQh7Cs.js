import{j as s}from"./jsx-runtime-CKrituN3.js";import{u as $,K as X}from"./index-1dq4XaDw.js";import{P as d,b as G,D as z,a as B}from"./datagrid.component-H9DjJ6Tg.js";import{u as K,a as W}from"./useColumnFilters-DqG3hznW.js";import{c,a as U}from"./datagrid.mock-CuHkqyDi.js";import"./index-CBqU2yxZ.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-DaQ_SeLH.js";import"./index-Bds5wOzB.js";import"./index-CzREU6hr.js";import"./index-BtM5VmRH.js";import"./clsx-B-dksMZM.js";import"./useTranslation-pmbu4BU3.js";import"./i18next-ihUiNgJT.js";const b=e=>Object.fromEntries([...e.entries()]),Z=e=>{const n={...G};if(e.has("page")){let t=parseInt(e.get("page"),10)-1;(Number.isNaN(t)||t<0)&&(t=0),n.pageIndex=t}if(e.has("pageSize")){let t=parseInt(e.get("pageSize"),10);d.includes(t)||([t]=d),n.pageSize=t}return n},q=(e,n)=>{const t={id:null,desc:!1};if(e.has("sort"))t.id=e.get("sort"),e.has("sortOrder")&&(t.desc=e.get("sortOrder")==="desc");else if(n)return n;return t},H=e=>{const[n,t]=$();return{pagination:Z(n),sorting:q(n,e),setPagination:({pageIndex:a,pageSize:r})=>{a>0?n.set("page",`${a+1}`):n.delete("page"),d.includes(r)&&r!==d[0]?n.set("pageSize",`${r}`):n.delete("pageSize"),t({...b(n)})},setSorting:({id:a,desc:r})=>{a?(n.set("sort",a),r?n.set("sortOrder","desc"):n.delete("sortOrder")):(n.delete("sort"),n.delete("sortOrder")),t({...b(n)})}}};function Q(e,n){if(!n)return e;const t=n.desc?-1:1;return n.id==="label"?e.sort((a,r)=>t*a.label.localeCompare(r.label)):n.id==="price"?e.sort((a,r)=>t*(a.price-r.price)):e}const p=({items:e,isPaginated:n,isSortable:t,columns:a=c,getRowCanExpand:r,renderSubComponent:j})=>{const[u]=$(),{pagination:m,setPagination:O,sorting:S,setSorting:T}=H({id:"validityTo",desc:!1}),h=n?m.pageIndex*m.pageSize:0,_=n?h+m.pageSize:e.length,M=n&&{pagination:m,onPaginationChange:O},N=t&&{sorting:S,onSortChange:T},{filters:P,addFilter:J,removeFilter:k}=K();return s.jsxs(s.Fragment,{children:[`${u}`&&s.jsxs(s.Fragment,{children:[s.jsxs("pre",{children:["Search params: ?",`${u}`]}),s.jsx("hr",{})]}),s.jsx(z,{columns:a,items:W(Q(e,S).slice(h,_),P),totalItems:e.length,...M,...N,filters:{filters:P,add:J,remove:k},getRowCanExpand:r,renderSubComponent:j})]})},o=p.bind({});o.args={columns:c,items:[...Array(50).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0};const i=p.bind({});i.args={columns:c,items:[...Array(8).keys()].map((e,n)=>({label:`Service #${n}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const l=p.bind({});l.args={items:[...Array(50).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0,columns:U};const g=p.bind({});g.args={columns:c,items:[...Array(10).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:e=>s.jsx(B,{children:JSON.stringify(e.original)})};const cn={title:"Components/Datagrid Paginated",component:z,decorators:[X],parameters:{status:{type:"deprecated"},docs:{description:{component:"The `Datagrid` component in pagination mode is now `deprecated`. Please switch to the cursor navigation mode"}}}};var C,f,x;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  columns = clm,
  getRowCanExpand,
  renderSubComponent
}: {
  items: Item[];
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
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} getRowCanExpand={getRowCanExpand} renderSubComponent={renderSubComponent} />
    </>;
}`,...(x=(f=o.parameters)==null?void 0:f.docs)==null?void 0:x.source}}};var F,y,w;i.parameters={...i.parameters,docs:{...(F=i.parameters)==null?void 0:F.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  columns = clm,
  getRowCanExpand,
  renderSubComponent
}: {
  items: Item[];
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
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} getRowCanExpand={getRowCanExpand} renderSubComponent={renderSubComponent} />
    </>;
}`,...(w=(y=i.parameters)==null?void 0:y.docs)==null?void 0:w.source}}};var I,E,A;l.parameters={...l.parameters,docs:{...(I=l.parameters)==null?void 0:I.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  columns = clm,
  getRowCanExpand,
  renderSubComponent
}: {
  items: Item[];
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
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} getRowCanExpand={getRowCanExpand} renderSubComponent={renderSubComponent} />
    </>;
}`,...(A=(E=l.parameters)==null?void 0:E.docs)==null?void 0:A.source}}};var R,v,D;g.parameters={...g.parameters,docs:{...(R=g.parameters)==null?void 0:R.docs,source:{originalSource:`({
  items,
  isPaginated,
  isSortable,
  columns = clm,
  getRowCanExpand,
  renderSubComponent
}: {
  items: Item[];
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
      <Datagrid columns={columns} items={applyFilters(sortItems(items, sorting).slice(start, end), filters)} totalItems={items.length} {...paginationAttrs} {...sortingAttrs} filters={{
      filters,
      add: addFilter,
      remove: removeFilter
    }} getRowCanExpand={getRowCanExpand} renderSubComponent={renderSubComponent} />
    </>;
}`,...(D=(v=g.parameters)==null?void 0:v.docs)==null?void 0:D.source}}};const pn=["Basic","Sortable","Filters","WithSubComponent"];export{o as Basic,l as Filters,i as Sortable,g as WithSubComponent,pn as __namedExportsOrder,cn as default};
