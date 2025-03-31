import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as t}from"./index-BkrqZoHw.js";import{M as o}from"./index-44Ewvqs0.js";import"./index-CpQqcCyD.js";/* empty css            */import"./breadcrumb.component-Wfvz5Ljz.js";import"./clipboard.component-BcTntzc6.js";import"./Step.component-DyEeZNOe.js";import"./Tabs.component-BIXFDCnP.js";import"./TilesInput.component-oevlRnWb.js";import"./headers.component-D47FqYGh.js";import"./price.component-C1gJlh2-.js";import"./dashboard-tile.component-P13jfuVw.js";import"./manager-tile.component-CHM12udA.js";import"./card.component-DahqeruP.js";import"./action.component-D_kD0_0W.js";import"./guide.component-CUKug_52.js";import"./changelog.component-DmJI5YYB.js";import"./base.component-BxUPkRFn.js";import"./error.component-CG954pOF.js";import"./error-boundary.component-BQdoPPUk.js";import"./onboarding.component-DE5SpbVu.js";import"./delete-modal.component-BraChuFD.js";import"./update-name-modal.component-D-oLkl5U.js";import"./title.component-ucIeg-_K.js";import"./links.component-Df8Bxhvl.js";import"./datagrid.component-CpJR9jc2.js";import"./index-Bnop-kX6.js";import"./notifications.component-DQbmNSMt.js";import"./ods-notification-BJu_JMvq.js";import"./useColumnFilters-DGGa5aCf.js";import"./ManagerButton-6adS761D.js";import"./ManagerText-CZwRM_Bn.js";import"./PciMaintenanceBanner.component-ZGjnQNY2.js";import"./region.component-DhyV69go.js";import"./Order.component-BfwlBoaU.js";import"./badge.component-fw4cCUA-.js";import"./iframe-DsLLCrTq.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-fg_2TIFA.js";import"./useOvhTracking-C6gVk9qp.js";import"./index-CqrMFMhJ.js";import"./useOvhIam-Rjw-h1Oe.js";import"./QueryClientProvider-Y_fKerI5.js";import"./infiniteQueryBehavior-zhId4Z-N.js";import"./useTranslation-I4D8sCWp.js";import"./i18next-DdipboBq.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./translation-Bzcle6L7.js";import"./error-banner-oops-tNXFEWkx.js";import"./click-utils-ByCElPrV.js";function r(i){const n={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager React Components/What's new/Migration guides/1.xx.x to 2.x.0"}),`
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
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:e.jsx(n.em,{children:"As each component was refactored, there are too many changes to list everything here, but its mainly refactoring some ods-text and ods-button"})})})]})}function se(i={}){const{wrapper:n}={...t(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{se as default};
