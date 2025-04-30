import{j as r}from"./jsx-runtime-BRNY0I4F.js";import{u as O,K as W}from"./index-4WNpmZbY.js";import{P as u,b as U,D as T,a as Z}from"./datagrid.component-BPLWHnfK.js";import{u as q,a as H}from"./useColumnFilters-DylE-TRj.js";import{c as m,a as Q}from"./datagrid.mock-CvUwqnyK.js";import"./index-Bnop-kX6.js";import"./index-CqrMFMhJ.js";import"./index-CYx7_Ein.js";import"./index-w9OafIJF.js";import"./index-4pTrEEYx.js";import"./ods-toggle2-B24SOLJO.js";import"./clsx-B-dksMZM.js";import"./useTranslation-DQ7TG6Ul.js";import"./context-BG98Yt4t.js";import"./i18next-6HYnolD1.js";const C=e=>Object.fromEntries([...e.entries()]),V=e=>{const n={...U};if(e.has("page")){let t=parseInt(e.get("page"),10)-1;(Number.isNaN(t)||t<0)&&(t=0),n.pageIndex=t}if(e.has("pageSize")){let t=parseInt(e.get("pageSize"),10);u.includes(t)||([t]=u),n.pageSize=t}return n},Y=(e,n)=>{const t={id:null,desc:!1};if(e.has("sort"))t.id=e.get("sort"),e.has("sortOrder")&&(t.desc=e.get("sortOrder")==="desc");else if(n)return n;return t},nn=e=>{const[n,t]=O();return{pagination:V(n),sorting:Y(n,e),setPagination:({pageIndex:a,pageSize:s})=>{a>0?n.set("page",`${a+1}`):n.delete("page"),u.includes(s)&&s!==u[0]?n.set("pageSize",`${s}`):n.delete("pageSize"),t({...C(n)})},setSorting:({id:a,desc:s})=>{a?(n.set("sort",a),s?n.set("sortOrder","desc"):n.delete("sortOrder")):(n.delete("sort"),n.delete("sortOrder")),t({...C(n)})}}};function en(e,n){if(!n)return e;const t=n.desc?-1:1;return n.id==="label"?e.sort((a,s)=>t*a.label.localeCompare(s.label)):n.id==="price"?e.sort((a,s)=>t*(a.price-s.price)):e}const c=({items:e,isPaginated:n,isSortable:t,isLoading:a=!1,columns:s=m,getRowCanExpand:_,renderSubComponent:M})=>{const[S]=O(),{pagination:p,setPagination:J,sorting:h,setSorting:N}=nn({id:"validityTo",desc:!1}),P=n?p.pageIndex*p.pageSize:0,X=n?P+p.pageSize:e.length,k=n&&{pagination:p,onPaginationChange:J},G=t&&{sorting:h,onSortChange:N},{filters:b,addFilter:B,removeFilter:K}=q();return r.jsxs(r.Fragment,{children:[`${S}`&&r.jsxs(r.Fragment,{children:[r.jsxs("pre",{children:["Search params: ?",`${S}`]}),r.jsx("hr",{})]}),r.jsx(T,{columns:s,items:H(en(e,h).slice(P,X),b),totalItems:e.length,isLoading:a,...k,...G,filters:{filters:b,add:B,remove:K},getRowCanExpand:_,renderSubComponent:M})]})},o=c.bind({});o.args={columns:m,items:[...Array(50).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0};const i=c.bind({});i.args={columns:m,items:[],isLoading:!0};const g=c.bind({});g.args={columns:m,items:[...Array(8).keys()].map((e,n)=>({label:`Service #${n}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const l=c.bind({});l.args={items:[...Array(50).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0,columns:Q};const d=c.bind({});d.args={columns:m,items:[...Array(10).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:e=>r.jsx(Z,{children:JSON.stringify(e.original)})};const bn={title:"Components/Datagrid Paginated",component:T,decorators:[W],parameters:{status:{type:"deprecated"},docs:{description:{component:"The `Datagrid` component in pagination mode is now `deprecated`. Please switch to the cursor navigation mode"}}}};var f,F,x;o.parameters={...o.parameters,docs:{...(f=o.parameters)==null?void 0:f.docs,source:{originalSource:`({
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
}`,...(j=(z=d.parameters)==null?void 0:z.docs)==null?void 0:j.source}}};const Cn=["Basic","Loading","Sortable","Filters","WithSubComponent"];export{o as Basic,l as Filters,i as Loading,g as Sortable,d as WithSubComponent,Cn as __namedExportsOrder,bn as default};
