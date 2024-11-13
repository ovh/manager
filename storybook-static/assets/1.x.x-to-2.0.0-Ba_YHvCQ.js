import{j as e}from"./jsx-runtime-CKrituN3.js";import"./blocks-BV28lYiK.js";import"./index-Q-VytQcI.js";import"./lib-Izy6Ibba.js";import"./pci-guides-header.component-BagPcmV1.js";import"./clipboard.component-cyGtq-9s.js";import"./Step.component-D2SFH0me.js";import"./Tabs.component-CQJ3RPtT.js";import"./TilesInput.component-BhQnwzgx.js";import"./headers.component-CdB4WDB_.js";import"./price.component-DWJdk9-Z.js";import"./dashboard-tile.component-BHwXF-Rw.js";import"./card.component-B6CWp-kH.js";import"./action.component-eB5qpv9J.js";import"./guide.component-BWphwWdg.js";import"./dashboard.component-B52snJOG.js";import"./base.component-Dg4_1DYh.js";import"./error.component-CNOKIvA3.js";import"./onboarding.component-DhZ7QQgk.js";import"./layout.component-DBLu0Nss.js";import"./delete-modal.component-BjDUbhdi.js";import"./update-name-modal.component-Cg9uoFVw.js";import"./title.component-W8VTwPen.js";import"./links.component-VacKWywg.js";import"./table.component-BfNjIkvp.js";import"./datagrid.component-hst3wSZU.js";import"./index-CBqU2yxZ.js";import"./datagrid.contants-DE5a_Gky.js";import"./notifications.component-CgyDPP7a.js";import"./ods-notification-CaNS6ZYS.js";import"./filter-list.component-Bug9_2lX.js";import"./ManagerButton-xscdT8pQ.js";import"./ManagerText-BQqHD0JV.js";import"./PciMaintenanceBanner.component-Bh9VXP43.js";import"./region.component-kKtC3z04.js";import{useMDXComponents as t}from"./index-DI5IigMn.js";import{M as o}from"./index-BImUgpoS.js";import"./QueryClientProvider-CDvRjfR1.js";import"./useOvhIam-ClA5hGHb.js";import"./_commonjsHelpers-BosuxZz1.js";import"./index-DP43DFaX.js";import"./index-BtM5VmRH.js";import"./index-4N_owrwP.js";import"./useTranslation-CvcVFFFk.js";import"./i18next-ihUiNgJT.js";import"./v4-DDYElseJ.js";import"./translation-CBNwEvwd.js";import"./click-utils-ByCElPrV.js";import"./iframe-6PvttXyO.js";import"../sb-preview/runtime.js";import"./index-Js5CwwSK.js";import"./_getPrototype-DZQDOC48.js";import"./index-D_r38UMq.js";import"./doctrine-CogHronv.js";import"./index-DrFu-skq.js";function r(i){const n=Object.assign({h1:"h1",p:"p",h2:"h2",h3:"h3",ul:"ul",li:"li",h4:"h4",pre:"pre",code:"code",strong:"strong",em:"em"},t(),i.components);return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/What's news/migration guide/1.xx.x to 2.0.0"}),`
`,e.jsx(n.h1,{id:"migration-from-1xx-to-200",children:"Migration from 1.x.x to 2.0.0"}),`
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
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-js",children:`@ovh-ux/manager-react-components: "^2.0.0"
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
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Actions Component"})," 'target', 'rel', 'label' updated to type 'string' , 'color' attribute remove"]}),`
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
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:e.jsx(n.em,{children:"As each component was refactored, there are too many changes to list everything here, but its mainly refactoring some ods-text and ods-button"})})})]})}function le(i={}){const{wrapper:n}=Object.assign({},t(),i.components);return n?e.jsx(n,Object.assign({},i,{children:e.jsx(r,i)})):r(i)}export{le as default};
//# sourceMappingURL=1.x.x-to-2.0.0-Ba_YHvCQ.js.map
