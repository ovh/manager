import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as o}from"./index-Bf_wDqJr.js";import"./index-CqmMgYso.js";/* empty css            */import"./breadcrumb.component-Bj4SDWmM.js";import"./clipboard.component-Da3g5HMM.js";import"./Step.component-BuDZjdkV.js";import"./Tabs.component-pcHwRHhX.js";import"./TilesInput.component-CSCccYCp.js";import"./headers.component-CKVBHe3N.js";import"./price.component-C4Vygo_m.js";import"./dashboard-tile.component-B4OBYwWK.js";import"./manager-tile.component-C-UOaU8u.js";import"./card.component-nt1Q_mnc.js";import"./action.component-DETXVUga.js";import"./guide.component-CgAD5bS3.js";import"./changelog.component-CsN4ogkC.js";import"./base.component-Cez4s4oV.js";import"./error.component-BohihVvZ.js";import"./error-boundary.component-HkxVu1X2.js";import"./onboarding.component-BS6kvZy4.js";import"./delete-modal.component-DE2gFF-3.js";import"./update-name-modal.component-BGkS8vuj.js";import"./title.component-Bx3BQPQH.js";import"./links.component-B_FCtcjf.js";import"./datagrid.component-Dzt5WZ-Y.js";import"./index-CBqU2yxZ.js";import"./notifications.component-Ca6nDj-a.js";import"./ods-notification-BPMGGTlT.js";import"./useColumnFilters-RgZVa838.js";import"./ManagerButton-C8zC-Fyb.js";import"./ManagerText-CIldxG9y.js";import"./PciMaintenanceBanner.component-BsusHqE4.js";import"./region.component-CGyiys5e.js";import"./Order.component-DO3UxPjZ.js";import"./badge.component-Clkk8G09.js";import{useMDXComponents as t}from"./index-C-_6Vi3R.js";import"./iframe-Dx6wIJYU.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";import"./index-BoGQ30sD.js";import"./useOvhTracking-C-_VjZ5i.js";import"./index-BkDLP3dD.js";import"./useOvhIam-puHWDhg2.js";import"./QueryClientProvider-DWOoNJcY.js";import"./infiniteQueryBehavior-BOpc6bB6.js";import"./useTranslation-pmbu4BU3.js";import"./i18next-ihUiNgJT.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./translation-xx6Js1fi.js";import"./error-banner-oops-tNXFEWkx.js";import"./click-utils-ByCElPrV.js";function r(n){const i=Object.assign({h1:"h1",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",h4:"h4",pre:"pre",code:"code",strong:"strong",em:"em"},t(),n.components);return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/What's new/Migration guides/1.xx.x to 2.x.0"}),`
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
`,e.jsx(i.p,{children:e.jsx(i.strong,{children:e.jsx(i.em,{children:"As each component was refactored, there are too many changes to list everything here, but its mainly refactoring some ods-text and ods-button"})})})]})}function de(n={}){const{wrapper:i}=Object.assign({},t(),n.components);return i?e.jsx(i,Object.assign({},n,{children:e.jsx(r,n)})):r(n)}export{de as default};
