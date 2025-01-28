import{j as e}from"./jsx-runtime-CKrituN3.js";import{M as o}from"./index-CsCNZlGy.js";import"./index-KJkR1nQ3.js";/* empty css            */import"./breadcrumb.component-DpRUzs0I.js";import"./pci-guides-header.component-CS872Opw.js";import"./clipboard.component-CzRK2Kss.js";import"./Step.component-BWp8kGvv.js";import"./Tabs.component-DXqTYqy5.js";import"./TilesInput.component-CI6PkBpT.js";import"./headers.component-DOIbi7y6.js";import"./price.component-CitMFzj8.js";import"./dashboard-tile.component-uJd7LCYi.js";import"./card.component-DWJCpXBY.js";import"./action.component-SgdxLXG2.js";import"./guide.component-CjPMspe6.js";import"./base.component-DHUbawA0.js";import"./error.component-COoA8t--.js";import"./onboarding.component-BVQ98j_C.js";import"./delete-modal.component-CQ2R3boW.js";import"./update-name-modal.component-BeoH3rsU.js";import"./title.component-Bx3BQPQH.js";import"./links.component-DFt-fbY5.js";import"./datagrid.component-DO4MRWS9.js";import"./index-CBqU2yxZ.js";import"./datagrid.contants-DE5a_Gky.js";import"./notifications.component-BhylwbDn.js";import"./ods-notification-gZlZHnxw.js";import"./filter-list.component-BU0r316C.js";import"./ManagerButton-CL8ziDJD.js";import"./ManagerText-DiPVJAip.js";import"./PciMaintenanceBanner.component-dTfH3Tc-.js";import"./region.component-owLJH7av.js";import{useMDXComponents as t}from"./index-DI5IigMn.js";import"./iframe-j0t04pea.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-BtM5VmRH.js";import"./index-D_r38UMq.js";import"./index-Cmc67Rxs.js";import"./index-DrFu-skq.js";import"./index-v66SXByX.js";import"./ShellContext-Bcy3tWt5.js";import"./index-4N_owrwP.js";import"./useOvhIam-D508DiNg.js";import"./QueryClientProvider-CDvRjfR1.js";import"./infiniteQueryBehavior-BOhwjgqB.js";import"./filters-D9DaemX1.js";import"./locale-D6U1IMhY.js";import"./i18next-6HYnolD1.js";import"./mutation-BoanVz2M.js";import"./useTranslation-Cbsqft5V.js";import"./context-DPnKhrhb.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./translation-CW5Eo54I.js";import"./error-banner-oops-tNXFEWkx.js";import"./click-utils-ByCElPrV.js";function r(n){const i=Object.assign({h1:"h1",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",h4:"h4",pre:"pre",code:"code",strong:"strong",em:"em"},t(),n.components);return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/What's new/Migration guides/1.xx.x to 2.x.0"}),`
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
`,e.jsx(i.p,{children:e.jsx(i.strong,{children:e.jsx(i.em,{children:"As each component was refactored, there are too many changes to list everything here, but its mainly refactoring some ods-text and ods-button"})})})]})}function ae(n={}){const{wrapper:i}=Object.assign({},t(),n.components);return i?e.jsx(i,Object.assign({},n,{children:e.jsx(r,n)})):r(n)}export{ae as default};
