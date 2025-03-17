import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as o}from"./index-CCTcRjX8.js";import"./index-Bds5wOzB.js";/* empty css            */import"./breadcrumb.component-BchIUMM9.js";import"./clipboard.component-BTcj6LPm.js";import"./Step.component-TT6NNP0K.js";import"./Tabs.component-CHx7tmpS.js";import"./TilesInput.component-Baaw-nN0.js";import"./headers.component-_MY88l-1.js";import"./price.component-BaZC1s65.js";import"./dashboard-tile.component-Bs83ogZ_.js";import"./manager-tile.component-CYgW_zbE.js";import"./card.component-BA5Qc17J.js";import"./action.component-D1Ur3BMC.js";import"./guide.component-Bcn93ruD.js";import"./changelog.component-duD3Tpkv.js";import"./base.component-B1cm5HUI.js";import"./error.component-Dv_OUHaW.js";import"./onboarding.component-C06AkbZ4.js";import"./delete-modal.component-DBuW-Dmq.js";import"./update-name-modal.component-B8Xgr33p.js";import"./title.component-Bx3BQPQH.js";import"./links.component-BTo7MDza.js";import"./datagrid.component-BllHRZTb.js";import"./index-CBqU2yxZ.js";import"./notifications.component-DpqVGXf7.js";import"./ods-notification-PVBsqYte.js";import"./useColumnFilters-D8VxGdZo.js";import"./ManagerButton-DDl44HCc.js";import"./ManagerText-cXA9djae.js";import"./PciMaintenanceBanner.component-CSbAudFJ.js";import"./region.component-CGyiys5e.js";import"./Order.component-D0PIPHZJ.js";import{useMDXComponents as t}from"./index-C-_6Vi3R.js";import"./iframe-uW-DDHZy.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";import"./index-K5baZMhq.js";import"./useOvhTracking-CUqAIfBm.js";import"./index-DaQ_SeLH.js";import"./useOvhIam-CeW1KcW4.js";import"./QueryClientProvider-DWOoNJcY.js";import"./infiniteQueryBehavior-BOpc6bB6.js";import"./useTranslation-pmbu4BU3.js";import"./i18next-ihUiNgJT.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./translation-xx6Js1fi.js";import"./error-banner-oops-tNXFEWkx.js";import"./click-utils-ByCElPrV.js";function r(n){const i=Object.assign({h1:"h1",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",h4:"h4",pre:"pre",code:"code",strong:"strong",em:"em"},t(),n.components);return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/What's new/Migration guides/1.xx.x to 2.x.0"}),`
`,e.jsx(i.h1,{id:"migration-from-1xx-to-2x0",children:"Migration from 1.x.x to 2.x.0"}),`
`,e.jsx(i.p,{children:`If you have any questions or issues regarding the new version, feel free to
reach us directly.`}),`
`,e.jsx(i.h2,{id:"libraries",children:"Libraries"}),`
`,e.jsx(i.h3,{id:"before-migration",children:"Before migration"}),`
`,e.jsx(i.p,{children:"Be sure, to allow time to :"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsx(i.li,{children:"To Bump the new react components versin in your uapp and correct the components updated that have changed"}),`
`,e.jsx(i.li,{children:"To update your existing unit test if needed"}),`
`,e.jsx(i.li,{children:"To Bump the version of ods inside your app v17 -> v18"}),`
`]}),`
`,e.jsx(i.h3,{id:"installation",children:"Installation"}),`
`,e.jsx(i.h4,{id:"update-your-packagejson",children:"update your package.json"}),`
`,e.jsx(i.pre,{children:e.jsx(i.code,{className:"language-js",children:`@ovh-ux/manager-react-components: "^2.x.0"
`})}),`
`,e.jsx(i.h4,{id:"import-css-files",children:"import css files"}),`
`,e.jsx(i.pre,{children:e.jsx(i.code,{className:"language-js",children:`import '@ovh-ux/manager-react-components/dist/style.css';
`})}),`
`,e.jsx(i.h2,{id:"components",children:"Components"}),`
`,e.jsx(i.p,{children:"The following components have been removed:"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"CommonTitle"})," you can replace by the component Title"]}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Description"})}),`
`]}),`
`,e.jsx(i.p,{children:"The following components have breaking change:"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"Links"})," 'target' attribute is now 'string'"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"UpdateNameModal"})," new attribute 'isOpen' at 'false' by default"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"DeleteModal"})," new attribute 'isOpen' at 'false' by default"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"Pci Maintenance Banner"})," 'type' attribue replace by 'color' type ODS_MESSSAGE_COLOR"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"Notifications"})," => (deprecated)"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"Guide component"})," 'target', 'rel', 'label' updated to type 'string'"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"Actions Component"})," 'target', 'rel', 'label' updated to type 'string', 'disabled' to 'isDisabled', 'color' attribute remove"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"OdsClipboard"})," new attributes 'labelCopySuccess', 'labelCopy'"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"ActionBanner component"})," attribute 'type' replace by 'color' ODS_MESSAGE_COLOR"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"Manager Button"})," => new attributes 'id' string and 'label' string"]}),`
`]}),`
`,e.jsx(i.p,{children:"The following components have been updated:"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Title"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"SubTitle"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Onboarding"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Error template"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Dashboard template"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Base template"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Table"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Redirection Guard"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Card Component"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"SimpleTileSInput"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Guide Header"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Filters"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Datagrid"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Price"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Headers"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Dashboard Tile"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Tabs"})}),`
`,e.jsx(i.li,{children:e.jsx(i.code,{children:"Steps"})}),`
`]}),`
`,e.jsx(i.p,{children:e.jsx(i.strong,{children:e.jsx(i.em,{children:"As each component was refactored, there are too many changes to list everything here, but its mainly refactoring some ods-text and ods-button"})})})]})}function le(n={}){const{wrapper:i}=Object.assign({},t(),n.components);return i?e.jsx(i,Object.assign({},n,{children:e.jsx(r,n)})):r(n)}export{le as default};
