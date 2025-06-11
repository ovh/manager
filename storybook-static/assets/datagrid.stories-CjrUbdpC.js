import{j as a}from"./jsx-runtime-BRNY0I4F.js";import{K}from"./index-DmxmtIj_.js";import{F as z,G as O,d as W,l as N,g as q,h as H}from"./manager-react-components-lib.es-DKxp4a7U.js";import{c as m,a as Q}from"./datagrid.mock-CZqzYQwL.js";import"./index-Bnop-kX6.js";import"./iframe-BXE16S2m.js";import"./QueryClientProvider-BkgfFh-U.js";import"./index-BA2H_d3W.js";import"./context-BVP_XnaJ.js";import"./index-D0sJu8id.js";import"./index-PzEU9Mdi.js";function U(e,n){if(!n)return e;const p=n.desc?-1:1;return n.id==="label"?e.sort((t,s)=>p*t.label.localeCompare(s.label)):n.id==="price"?e.sort((t,s)=>p*(t.price-s.price)):e}const d=({items:e,isPaginated:n,isSortable:p,isLoading:t=!1,columns:s=m,getRowCanExpand:M,renderSubComponent:j})=>{const[u]=W(),{pagination:c,setPagination:T,sorting:S,setSorting:_}=N({id:"validityTo",desc:!1}),h=n?c.pageIndex*c.pageSize:0,J=n?h+c.pageSize:e.length,X=n&&{pagination:c,onPaginationChange:T},k=p&&{sorting:S,onSortChange:_},{filters:b,addFilter:G,removeFilter:B}=q();return a.jsxs(a.Fragment,{children:[`${u}`&&a.jsxs(a.Fragment,{children:[a.jsxs("pre",{children:["Search params: ?",`${u}`]}),a.jsx("hr",{})]}),a.jsx(z,{columns:s,items:H(U(e,S).slice(h,J),b),totalItems:e.length,isLoading:t,...X,...k,filters:{filters:b,add:G,remove:B},getRowCanExpand:M,renderSubComponent:j})]})},o=d.bind({});o.args={columns:m,items:[...Array(50).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0};const r=d.bind({});r.args={columns:m,items:[],isLoading:!0};const i=d.bind({});i.args={columns:m,items:[...Array(8).keys()].map((e,n)=>({label:`Service #${n}`,price:Math.floor(1+Math.random()*100)})),isSortable:!0};const g=d.bind({});g.args={items:[...Array(50).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),isPaginated:!0,isSortable:!0,columns:Q};const l=d.bind({});l.args={columns:m,items:[...Array(10).keys()].map((e,n)=>({label:`Item #${n}`,price:Math.floor(1+Math.random()*100)})),getRowCanExpand:()=>!0,renderSubComponent:e=>a.jsx(O,{children:JSON.stringify(e.original)})};const ln={title:"Manager React Components/Components/Datagrid Paginated",component:z,decorators:[K],parameters:{status:{type:"deprecated"},docs:{description:{component:"The `Datagrid` component in pagination mode is now `deprecated`. Please switch to the cursor navigation mode"}}}};var P,C,f;o.parameters={...o.parameters,docs:{...(P=o.parameters)==null?void 0:P.docs,source:{originalSource:`({
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
}`,...(f=(C=o.parameters)==null?void 0:C.docs)==null?void 0:f.source}}};var F,w,y;r.parameters={...r.parameters,docs:{...(F=r.parameters)==null?void 0:F.docs,source:{originalSource:`({
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
}`,...(y=(w=r.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};var x,R,E;i.parameters={...i.parameters,docs:{...(x=i.parameters)==null?void 0:x.docs,source:{originalSource:`({
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
}`,...(E=(R=i.parameters)==null?void 0:R.docs)==null?void 0:E.source}}};var A,I,v;g.parameters={...g.parameters,docs:{...(A=g.parameters)==null?void 0:A.docs,source:{originalSource:`({
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
}`,...(v=(I=g.parameters)==null?void 0:I.docs)==null?void 0:v.source}}};var L,$,D;l.parameters={...l.parameters,docs:{...(L=l.parameters)==null?void 0:L.docs,source:{originalSource:`({
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
}`,...(D=($=l.parameters)==null?void 0:$.docs)==null?void 0:D.source}}};const mn=["Basic","Loading","Sortable","Filters","WithSubComponent"];export{o as Basic,g as Filters,r as Loading,i as Sortable,l as WithSubComponent,mn as __namedExportsOrder,ln as default};
