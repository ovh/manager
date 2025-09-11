import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-B3brjphm.js";import{M as l}from"./index-y5n-9ldd.js";import"./index-PzEU9Mdi.js";import"./manager-react-components-lib.es-BrIjysQ8.js";import"./index-Bnop-kX6.js";import"./iframe-8U4jGQrW.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";function r(i){const n={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Manager React Components/What's new/Migration guides/1.xx.x to 2.x.0"}),`
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
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:e.jsx(n.em,{children:"As each component was refactored, there are too many changes to list everything here, but its mainly refactoring some ods-text and ods-button"})})})]})}function f(i={}){const{wrapper:n}={...s(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{f as default};
