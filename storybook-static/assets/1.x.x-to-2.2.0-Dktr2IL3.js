import{j as e}from"./jsx-runtime-CKrituN3.js";import"./blocks-BV28lYiK.js";import"./index-Cj4I0lin.js";import"./lib-Izy6Ibba.js";import"./pci-guides-header.component-CaAK7oAC.js";import"./clipboard.component-Dhlf5Uex.js";import"./Step.component-DNtmLy7S.js";import"./Tabs.component-LsLCvKbg.js";import"./TilesInput.component-D7QBCypN.js";import"./headers.component-BNjCNQdS.js";import"./price.component-BtLn6ZPU.js";import"./dashboard-tile.component-DdmgL_VR.js";import"./card.component-phKAhC05.js";import"./action.component-DT_deZMX.js";import"./guide.component-T0oC1rTO.js";import"./dashboard.component-CzBP0WPt.js";import"./base.component-Ccg_wfHB.js";import"./error.component-CjV8RhSV.js";import"./onboarding.component-BFUlLQPX.js";import"./layout.component-DBLu0Nss.js";import"./delete-modal.component-D_3ErsL3.js";import"./update-name-modal.component-D4iqQ4rt.js";import"./title.component-Bx3BQPQH.js";import"./links.component-8FZkxRYj.js";import"./table.component-CujkXM5j.js";import"./datagrid.component-f04MfhC1.js";import"./index-CBqU2yxZ.js";import"./datagrid.contants-DE5a_Gky.js";import"./notifications.component-P_SDvlcN.js";import"./ods-notification-DTyfvAAI.js";import"./filter-list.component-Cnvl9fVt.js";import"./ManagerButton-NvLKSryj.js";import"./ManagerText-BnXOfxae.js";import"./PciMaintenanceBanner.component-Cv_IjYEP.js";import"./region.component-kKtC3z04.js";import{useMDXComponents as t}from"./index-DI5IigMn.js";import{M as o}from"./index-vINPuXOj.js";import"./QueryClientProvider-CDvRjfR1.js";import"./useOvhIam-ClA5hGHb.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-DGMs7m44.js";import"./index-BtM5VmRH.js";import"./index-4N_owrwP.js";import"./useTranslation-CvcVFFFk.js";import"./i18next-ihUiNgJT.js";import"./v4-DDYElseJ.js";import"./translation-CBNwEvwd.js";import"./click-utils-ByCElPrV.js";import"./iframe-BW04Thgz.js";import"../sb-preview/runtime.js";import"./index-Js5CwwSK.js";import"./_getPrototype-DZQDOC48.js";import"./index-D_r38UMq.js";import"./doctrine-CogHronv.js";import"./index-DrFu-skq.js";function r(n){const i=Object.assign({h1:"h1",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",h4:"h4",pre:"pre",code:"code",strong:"strong",em:"em"},t(),n.components);return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/What's news/migration guide/1.xx.x to 2.2.0"}),`
`,e.jsx(i.h1,{id:"migration-from-1xx-to-220",children:"Migration from 1.x.x to 2.2.0"}),`
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
`,e.jsx(i.pre,{children:e.jsx(i.code,{className:"language-js",children:`@ovh-ux/manager-react-components: "^2.2.0"
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
//# sourceMappingURL=1.x.x-to-2.2.0-Dktr2IL3.js.map
