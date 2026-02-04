import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-g6nCrg6v.js";import{M as o}from"./index-CFQnl7m9.js";import"./index-Bnop-kX6.js";import"./iframe-CaW5sJsF.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function i(r){const n={code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...s(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Manager UI Kit/What's new/Migration guides/Move to Manager UI Kit v1"}),`
`,e.jsx(n.h1,{id:"move-to-manager-ui-kit-v1",children:"Move to Manager UI Kit v1"}),`
`,e.jsxs(n.p,{children:["This guide documents the initial migration from ",e.jsx(n.code,{children:"manager-ui-kit"})," to ",e.jsx(n.code,{children:"manager-ui-kit"})," within the repository."]}),`
`,e.jsx(n.p,{children:"⚠️ MUK serves as the single source of truth for styles and components; direct imports of Components or CSS from ODS within applications are not recommended."}),`
`,e.jsx(n.h2,{id:"summary",children:"Summary"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Package renamed: ",e.jsx(n.code,{children:"packages/manager-ui-kit"})," → ",e.jsx(n.code,{children:"packages/manager-ui-kit"}),"."]}),`
`,e.jsxs(n.li,{children:["New package name: ",e.jsx(n.code,{children:"@ovh-ux/muk"}),"."]}),`
`,e.jsxs(n.li,{children:["Wiki stories moved to ",e.jsx(n.code,{children:"packages/manager-wiki/stories/manager-ui-kit/**"}),"."]}),`
`,e.jsxs(n.li,{children:["Root configs updated to reference ",e.jsx(n.code,{children:"packages/manager-ui-kit"}),"."]}),`
`,e.jsxs(n.li,{children:["Apps and modules were NOT migrated (they still use ",e.jsx(n.code,{children:"@ovh-ux/muk"}),")."]}),`
`]}),`
`,e.jsx(n.h2,{id:"install",children:"Install"}),`
`,e.jsxs(n.p,{children:["Update your ",e.jsx(n.code,{children:"package.json"})," if you plan to adopt the new package in your project:"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-json",children:`"@ovh-ux/muk": "^1.x"
`})}),`
`,e.jsx(n.p,{children:"Import the stylesheet if needed:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-js",children:`import '@ovh-ux/muk/dist/style.css';
`})}),`
`,e.jsx(n.h2,{id:"imports-before--after",children:"Imports (before → after)"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`// Before
import { Button } from '@ovh-ux/manager-react-components';

// After
import { Button } from '@ovh-ux/muk';
`})}),`
`,e.jsx(n.p,{children:"Assets referenced from the package should also point to the new scope if you adopt it:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-ts",children:`// Before
import placeholder from '@ovh-ux/manager-react-components/public/assets/placeholder.png';

// After
import placeholder from '@ovh-ux/muk/public/assets/placeholder.png';
`})}),`
`,e.jsx(n.h2,{id:"storybook-structure",children:"Storybook structure"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Stories moved from ",e.jsx(n.code,{children:"stories/manager-ui-kit/**"})," to ",e.jsx(n.code,{children:"stories/manager-ui-kit/**"}),"."]}),`
`,e.jsx(n.li,{children:'Sidebar category now appears under "Manager UI Kit/...".'}),`
`]}),`
`,e.jsx(n.h2,{id:"quick-checklist",children:"Quick checklist"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Update imports to ",e.jsx(n.code,{children:"@ovh-ux/muk"})," (only where migrating now)."]}),`
`,e.jsx(n.li,{children:"Keep apps/modules unchanged unless explicitly migrating."}),`
`,e.jsx(n.li,{children:"Update CSS import if you rely on the kit’s stylesheet."}),`
`]}),`
`,e.jsx(n.p,{children:"If you have questions or issues, reach control twoer team to the UI Kit maintainers."})]})}function u(r={}){const{wrapper:n}={...s(),...r.components};return n?e.jsx(n,{...r,children:e.jsx(i,{...r})}):i(r)}export{u as default};
