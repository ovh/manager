import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as o}from"./index-CDvvSBOu.js";import"./index-Cs_lFblA.js";/* empty css            */import"./breadcrumb.component-D25n6d0h.js";import"./clipboard.component-CsQRqDkv.js";import"./Step.component-QIZYdI11.js";import"./Tabs.component-DIrmTQud.js";import"./TilesInput.component-Bh0yfcdO.js";import"./headers.component-BBM8O939.js";import"./price.component-1fFGDwpF.js";import"./dashboard-tile.component-BbJwCSD6.js";import"./card.component-CeFUCOA8.js";import"./action.component-cxNfOTVC.js";import"./guide.component-CnARdpFu.js";import"./base.component-p0NVqklE.js";import"./error.component-BD2wGBdO.js";import"./onboarding.component-D6vgrdie.js";import"./delete-modal.component-xCTstyAM.js";import"./update-name-modal.component-DF6SQBCl.js";import"./title.component-Bx3BQPQH.js";import"./links.component-DUo1K6KO.js";import"./datagrid.component-_GGgxQ6j.js";import"./index-CBqU2yxZ.js";import"./notifications.component-Cvxz3lLX.js";import"./ods-notification-BDGA612R.js";import"./useColumnFilters-CFW73QpZ.js";import"./ManagerButton-BMV99zZ4.js";import"./ManagerText-DvRzIKE1.js";import"./PciMaintenanceBanner.component-DSQREQWH.js";import"./region.component-kKtC3z04.js";import{useMDXComponents as t}from"./index-DI5IigMn.js";import"./iframe-C5-nNP3f.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";import"./index-D2Jq8zTl.js";import"./index-4N_owrwP.js";import"./useOvhIam-D508DiNg.js";import"./QueryClientProvider-CDvRjfR1.js";import"./infiniteQueryBehavior-BL00SVfC.js";import"./useTranslation-CvcVFFFk.js";import"./i18next-ihUiNgJT.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./translation-CBNwEvwd.js";import"./error-banner-oops-tNXFEWkx.js";import"./click-utils-ByCElPrV.js";function r(i){const n=Object.assign({h1:"h1",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",h4:"h4",pre:"pre",code:"code",strong:"strong",em:"em"},t(),i.components);return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/What's new/Migration guides/1.xx.x to 2.x.0"}),`
`,e.jsx(n.h1,{id:"migration-from-1xx-to-2x0",children:"Migration from 1.x.x to 2.x.0"}),`
`,e.jsx(n.p,{children:`If you have any questions or issues regarding the new version, feel free to
reach us directly.`}),`
`,e.jsx(n.h2,{id:"libraries",children:"Libraries"}),`
`,e.jsx(n.h3,{id:"before-migration",children:"Before migration"}),`
`,e.jsx(n.p,{children:"Be sure, to allow time to :"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"To Bump the new react components versin in your uapp and correct the components updated that have changed"}),`
`,e.jsx(n.li,{children:"To update your existing unit test if needed"}),`
`,e.jsx(n.li,{children:"To Bump the version of ods inside your app v17 -> v18"}),`
`]}),`
`,e.jsx(n.h3,{id:"installation",children:"Installation"}),`
`,e.jsx(n.h4,{id:"update-your-packagejson",children:"update your package.json"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-js",children:`@ovh-ux/manager-react-components: "^2.x.0"
`})}),`
`,e.jsx(n.h4,{id:"import-css-files",children:"import css files"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-js",children:`import '@ovh-ux/manager-react-components/dist/style.css';
`})}),`
`,e.jsx(n.h2,{id:"components",children:"Components"}),`
`,e.jsx(n.p,{children:"The following components have been removed:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"CommonTitle"})," you can replace by the component Title"]}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Description"})}),`
`]}),`
`,e.jsx(n.p,{children:"The following components have breaking change:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Links"})," 'target' attribute is now 'string'"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"UpdateNameModal"})," new attribute 'isOpen' at 'false' by default"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"DeleteModal"})," new attribute 'isOpen' at 'false' by default"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Pci Maintenance Banner"})," 'type' attribue replace by 'color' type ODS_MESSSAGE_COLOR"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Notifications"})," => (deprecated)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Guide component"})," 'target', 'rel', 'label' updated to type 'string'"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Actions Component"})," 'target', 'rel', 'label' updated to type 'string', 'disabled' to 'isDisabled', 'color' attribute remove"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"OdsClipboard"})," new attributes 'labelCopySuccess', 'labelCopy'"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"ActionBanner component"})," attribute 'type' replace by 'color' ODS_MESSAGE_COLOR"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Manager Button"})," => new attributes 'id' string and 'label' string"]}),`
`]}),`
`,e.jsx(n.p,{children:"The following components have been updated:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Title"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"SubTitle"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Onboarding"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Error template"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Dashboard template"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Base template"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Table"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Redirection Guard"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Card Component"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"SimpleTileSInput"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Guide Header"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Filters"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Datagrid"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Price"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Headers"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Dashboard Tile"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Tabs"})}),`
`,e.jsx(n.li,{children:e.jsx(n.code,{children:"Steps"})}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:e.jsx(n.em,{children:"As each component was refactored, there are too many changes to list everything here, but its mainly refactoring some ods-text and ods-button"})})})]})}function re(i={}){const{wrapper:n}=Object.assign({},t(),i.components);return n?e.jsx(n,Object.assign({},i,{children:e.jsx(r,i)})):r(i)}export{re as default};
