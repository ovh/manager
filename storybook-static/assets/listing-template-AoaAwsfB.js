import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-BbLPDwHm.js";import{M as t}from"./index-CKSIDW05.js";import"./index-Bnop-kX6.js";import"./iframe-DqxQzjvh.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";const o=""+new URL("listing-actions-DrDD_OS1.png",import.meta.url).href,c=""+new URL("listing-headers-BCMbmhZ9.png",import.meta.url).href,a=""+new URL("listing-cta-pCi5eUVW.png",import.meta.url).href;function s(r){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(t,{title:"Guidelines/React Templates/Listing page"}),`
`,e.jsx(n.h1,{id:"how-to-add-a-listing-page",children:"How to add a Listing Page"}),`
`,e.jsx(n.p,{children:"The listing page is a React component that displays data in a datagrid format with filtering, sorting, and search capabilities. Here's how it's structured:"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:"💡 Good to know"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"Listing"})," is already implemented in the ",e.jsx(n.a,{href:"https://github.com/ovh/manager/tree/master/packages/manager/core/generator",rel:"nofollow",children:e.jsx(n.code,{children:"generator"})})," by default, you just have to add and update some part of the code"]}),`
`]}),`
`,e.jsx(n.h2,{id:"-as-a-developer",children:"👨‍💻 As a developer"}),`
`,e.jsxs(n.p,{children:["When you generate a project, you have to choose your ",e.jsx(n.strong,{children:"listing endpoint"})," from ",e.jsx(n.code,{children:"APIV2"})," or ",e.jsx(n.code,{children:"APIV6"}),"."]}),`
`,e.jsxs(n.p,{children:["Once the project generated, in you folder app generated, you will find ",e.jsx(n.code,{children:"src/pages/listing/index.tsx"})," file."]}),`
`,e.jsx(n.p,{children:"You have a default listing template that display all the attributes of your api response."}),`
`,e.jsx(n.h2,{id:"-datagrid",children:"📊 Datagrid"}),`
`,e.jsx(n.h3,{id:"-api-calls",children:"🔌 API CALLS"}),`
`,e.jsx(n.p,{children:"Here you can find the differents use cases for your app."}),`
`,e.jsx(n.h4,{id:"-apiv6",children:"🚀 APIV6"}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"useResourcesIcebergV6"})," (by default), ",e.jsx(n.a,{href:"?path=/docs/manager-react-components-hooks-useresourcesicebergv6--technical-information",children:"documentation"})," :"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Advanced hook for Iceberg V6 API calls"}),`
`,e.jsx(n.li,{children:"Data Filtering, searching, sorting features"}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:`🔍 By default the search feature is configured on the first columns of your table
🔄 Sorting, Searching and filtering are provided by Iceberg`}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"useResourcesV6"})," ",e.jsx(n.a,{href:"?path=/docs/manager-react-components-hooks-useresourcesv6--technical-information",children:"documentation"})," :"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Basic hook for V6 API calls"}),`
`,e.jsx(n.li,{children:"Handles data fetching and state management"}),`
`,e.jsx(n.li,{children:"Data Filtering, searching, sorting features"}),`
`,e.jsx(n.li,{children:"Provides error handling and loading states"}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsx(n.p,{children:`🔍 Search feature work in all your columns
🔄 Sorting, Searching and filtering are made in local`}),`
`]}),`
`,e.jsxs(n.p,{children:["If you want to change, the search columns, you have to update your columns definition object ",e.jsx(n.code,{children:"isSearchable"})," at ",e.jsx(n.code,{children:"true"})]}),`
`,e.jsx(n.h4,{id:"-apiv2",children:"🚀 APIV2"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"useResourcesIcebergV2"})," ",e.jsx(n.a,{href:"?path=/docs/manager-react-components-hooks-useresourcesicebergv2--technical-information",children:"documentation"})," :",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Advanced hook for Iceberg V2 API calls"}),`
`,e.jsx(n.li,{children:"Sorting feature"}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["🔗 If you need to aggregate data from another with V6 or V2 response, you can create a ",e.jsx(n.code,{children:"Custom Hook"})," or consider creating new BFF."]}),`
`]}),`
`,e.jsx(n.h3,{id:"tanstack-table",children:"TANSTACK TABLE"}),`
`,e.jsx(n.h4,{id:"-columns-definition",children:"📝 Columns Definition"}),`
`,e.jsxs(n.p,{children:["For the ",e.jsx(n.code,{children:"column definition"}),", you have to create a constant variable ",e.jsx(n.code,{children:"columns"}),"."]}),`
`,e.jsx(n.p,{children:"We recommand to create a component to display your custom data."}),`
`,e.jsx(n.p,{children:"Here an exemple for Key Management app."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const columns = useMemo(() => {
  return [
    {
      id: 'name',
      cell: DatagridCellName,
      label: t('key_management_service_listing_name_cell'),
    },
    {
      id: 'id',
      cell: DatagridCellId,
      label: t('key_management_service_listing_id_cell'),
    },
    {
      id: 'kmip_count',
      cell: DatagridResourceKmipCountCell,
      label: t('key_management_service_listing_kmip_cell'),
    },
    {
      id: 'action',
      cell: KmsActionMenu,
      label: '',
    },
  ];
}, []);
`})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["⚠️ ",e.jsx(n.strong,{children:"Important Note"})]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"We recommand to use useMemo for you columns definition"}),`
`,e.jsx(n.li,{children:"Action columns will be always at the end of the datagrid."}),`
`]}),`
`]}),`
`,e.jsx(n.h3,{id:"️-features",children:"⚙️ FEATURES"}),`
`,e.jsx(n.p,{children:"If you want to :"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["🔽 ",e.jsx(n.code,{children:"expand"})," a row, you can use the ",e.jsx(n.code,{children:"renderSubComponent"})," attributes."]}),`
`,e.jsxs(n.li,{children:["🔍 ",e.jsx(n.code,{children:"search"})," in columns, add ",e.jsx(n.code,{children:"isSearchable"})," attribute at ",e.jsx(n.code,{children:"true"})]}),`
`,e.jsxs(n.li,{children:["🔄 ",e.jsx(n.code,{children:"filter"})," in columns, add ",e.jsx(n.code,{children:"isFilterable"})," attribute at ",e.jsx(n.code,{children:"true"})]}),`
`]}),`
`,e.jsx(n.h4,{id:"-actions",children:"🎯 ACTIONS"}),`
`,e.jsx("img",{src:o,alt:"Listing Page headers buttons",width:"200"}),`
`,e.jsxs(n.p,{children:["When you want to trigger action from a service, you can use ",e.jsx(n.code,{children:"ActionMenu"})," component from ",e.jsx(n.code,{children:"manager-react-components"})]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { ActionMenu } from '@ovh-ux/manager-react-components';

const Actions = () => {
  const actionItems = [
    {
      id: 1,
      onClick: () => console.info('edit'),
      urn: infoServiceUrn',
      iamActions: ['action-edit', 'getInfos'],
      label: t('modify'),
    },
    {
      id: 2,
      onClick: () => console.info('delete'),
      urn: infoServiceUrn',
      iamActions: ['action-delete', 'getInfos'],
      label: t('delete'),
    },
  ];

  return (
    <ActionMenu
      id={item.id}
      items={actionItems.filter((i) => !i.hidden)}
      variant={ODS_BUTTON_VARIANT.ghost}
      isCompact
    />
  );
}
`})}),`
`,e.jsx(n.p,{children:"You can also check IAM right if needed."}),`
`,e.jsx(n.h3,{id:"-header-button",children:"🔝 Header button"}),`
`,e.jsx(n.p,{children:"If you need to add externals links for changelog or guides, you can use the header attributes of BaseComponent layout"}),`
`,e.jsx("img",{src:c,alt:"Listing Page headers buttons",width:"200"}),`
`,e.jsx(n.p,{children:"Here You can find a code exemple :"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import {
  BaseLayout,
  ChangelogButton,
  GuideButton
} from '@ovh-ux/manager-react-components';

const guideItems = [
  {
    id: 1,
    href: 'https://www.ovh.com',
    target: '_blank',
    label: 'ovh.com',
  },
  {
    id: 2,
    href: 'https://help.ovhcloud.com/csm/fr-documentation?id=kb_home',
    target: '_blank',
    label: 'Guides OVH',
  },
];

return (
  <BaseLayout
    header={{
      changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      headerButton: <GuideButton items={guideItems} />
    }}
  >
)
`})}),`
`,e.jsx(n.h3,{id:"️-deprecation",children:"⚠️ DEPRECATION"}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["⚠️ ",e.jsx(n.strong,{children:"Warning"})]}),`
`,e.jsxs(n.p,{children:["We have deprecated the ",e.jsx(n.code,{children:"pagination"})," navigation."]}),`
`]}),`
`,e.jsx(n.h3,{id:"-polling-data",children:"🔄 POLLING DATA"}),`
`,e.jsxs(n.p,{children:["If you need to refresh you data, you can use a polling from ",e.jsx(n.code,{children:"tanstack query"}),"."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"refethInterval"})," is available from ",e.jsx(n.code,{children:"useInfiniteQuery"})," then also in ",e.jsx(n.code,{children:"useResourcesIcebergV6"}),", ",e.jsx(n.code,{children:"useResourcesV6"}),"and ",e.jsx(n.code,{children:"useResourcesIcebergV2"}),"."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const POLLING_INTERVAL = 5000;

const {
  data,
  fetchNextPage,
  hasNextPage,
  flattenData,
  isError,
  isLoading,
  sorting,
  setSorting,
  error,
  status,
} = useResourcesIcebergV2({
  route: \`\${API_ENDPOINT}\`,
  queryKey: [\${API_QUERY_KEY}],
  refetchInterval: POLLING_INTERVAL
});
`})}),`
`,e.jsx(n.h2,{id:"-handling-errors",children:"🚨 Handling errors"}),`
`,e.jsxs(n.p,{children:["In case of API V6 or V2, response error for the main request, app will be display ",e.jsx(n.code,{children:"ErrorBanner"})," from ",e.jsx(n.code,{children:"manager-react-components"}),"."]}),`
`,e.jsx(n.p,{children:"We redirect the user to the error page, if the main request endpoint is in failure."}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`const { isError, error, status } = useResourcesIcebergV2({
  route: '/dedicated/server',
  queryKey: ['appName', '/dedicated/server'],
});

if (isError) {
  const { response }: any = error;
  const errorObj = {
    data: error,
    headers: response.headers,
    status: response.status,
  };
  return <ErrorBanner error={errorObj} />;
}
`})}),`
`,e.jsx(n.h2,{id:"-cta-button",children:"🎯 CTA BUTTON"}),`
`,e.jsx("img",{src:a,alt:"Listing Page cta"}),`
`,e.jsxs(n.p,{children:["The CTA button is alway at datagrid top left, you need to fill ",e.jsx(n.code,{children:"topbar"})," attributes of ",e.jsx(n.code,{children:"datagrid"})," component from ",e.jsx(n.code,{children:"manager-react-components"})]}),`
`,e.jsx(n.h2,{id:"-tracking-checklist",children:"📊 TRACKING Checklist"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"[ ] TrackPage display tracking on component mount"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - BaseLayout Headers components links buttons"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - Datagrid action buttons"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - Datagrid links button"}),`
`,e.jsx(n.li,{children:"[ ] TrackClick - CTA button"}),`
`]}),`
`,e.jsx(n.h2,{id:"-code-review-checklist",children:"✅ Code Review Checklist"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["[ ] Use ",e.jsx(n.code,{children:"BaseLayout"})," Component from ",e.jsx(n.code,{children:"manager-react-components"})]}),`
`,e.jsxs(n.li,{children:["API call :",`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["[ ] For V2 API call with Iceberg, use ",e.jsx(n.code,{children:"useResourcesIcebergV2"})]}),`
`,e.jsxs(n.li,{children:["[ ] For V6 API call with Iceberg, use ",e.jsx(n.code,{children:"useResourcesIcebergV6"})]}),`
`,e.jsxs(n.li,{children:["[ ] For V6 API call without Iceberg, use ",e.jsx(n.code,{children:"useResourcesV6"})]}),`
`,e.jsx(n.li,{children:"[ ] For API call with agregatted data, create a custom hook"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["[ ] ",e.jsx(n.code,{children:"CTA Button"})," always in datagrid ",e.jsx(n.code,{children:"topbar"})," attribute"]}),`
`,e.jsxs(n.li,{children:["[ ] Notifications success/errors",e.jsx(n.code,{children:"in"}),"message` attribute of base layout component"]}),`
`]})]})}function p(r={}){const{wrapper:n}={...i(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(s,{...r})}):s(r)}export{p as default};
