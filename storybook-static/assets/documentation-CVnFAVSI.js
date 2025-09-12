import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-CdjcsXAS.js";import{b as r,S as e,c as l,a as d,d as c}from"./index-b8hj9e6-.js";import{M as p,C as h}from"./index-znkjjTxY.js";import u,{Default as x}from"./ManagerButton.stories-CuDCvQPI.js";import{e as i}from"./external-links-Bni12-7h.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-oX_7i0mk.js";import"./index-D0sJu8id.js";import"./iframe-CHNKH7Wl.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./manager-react-components-lib.es-CtFOZylL.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";import"./iam.constants-DtqzYIv-.js";function s(o){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...a(),...o.components};return t.jsxs(t.Fragment,{children:[t.jsx(p,{title:"Manager React Components/Components/Manager Button/Documentation"}),`
`,t.jsx(r,{of:u}),`
`,t.jsx(h,{layout:"centered",of:x,sourceState:"none"}),`
`,t.jsx(e,{label:"Overview",level:2}),`
`,t.jsx(l,{githubUrl:i.github.managerButton,name:"ManagerButton",relatedComponents:[{name:"ods-button",href:i.ods.button},{name:"ods-tooltip",href:i.ods.tooltip}],children:t.jsxs(n.p,{children:["The ",t.jsx(n.strong,{children:"Manager Button"}),` component is a wrapper for OdsButton that provides an additional capability of disabled Button with an optional
Tooltip for additional context if user does not have access to perform the associated action. It is designed to support actions or events,
with optional URN and IAM actions properties to associate the Tooltip content
with external resources. The component supports internationalization (i18n).`]})}),`
`,t.jsx(e,{label:"Anatomy",level:2}),`
`,t.jsxs(n.ol,{children:[`
`,t.jsxs(n.li,{children:[t.jsx(n.strong,{children:"ODS Button"}),": it is always disabled with customizable label; it serves as the trigger for the Tooltip"]}),`
`,t.jsxs(n.li,{children:[t.jsx(n.strong,{children:"ODS Tooltip"})," (optional): it displays contextual information about the disabled Button; can be omitted if no Tooltip is needed"]}),`
`]}),`
`,t.jsx(e,{label:"Usage",level:2}),`
`,t.jsxs(n.p,{children:["Use the ",t.jsx(n.strong,{children:"Manager Button"})," to provide users with a disabled button display a concise text requiring additional explanation via a tooltip."]}),`
`,t.jsx(e,{label:"Dos & Don'ts",level:2}),`
`,t.jsx(d,{dos:["Do use the Manager Button for succinct, content requiring contextual explanations","Do provide valid URN and IAM actions"],donts:["Do not use the Manager Button for purely decorative purposes"]}),`
`,t.jsx(e,{label:"Placement",level:2}),`
`,t.jsxs(n.p,{children:["The ",t.jsx(n.strong,{children:"Manager Button"})," component is typically used inline within a table, or alongside other UI elements where additional explanation is necessary."]}),`
`,t.jsx(e,{label:"Behavior",level:2}),`
`,t.jsx(n.p,{children:t.jsx(n.strong,{children:"States"})}),`
`,t.jsxs(n.ul,{children:[`
`,t.jsxs(n.li,{children:[t.jsx(n.strong,{children:"Default"}),":",`
`,t.jsxs(n.ul,{children:[`
`,t.jsx(n.li,{children:"The text is visible, and the tooltip is hidden by default"}),`
`]}),`
`]}),`
`,t.jsxs(n.li,{children:[t.jsx(n.strong,{children:"Hover and focus"}),":",`
`,t.jsxs(n.ul,{children:[`
`,t.jsx(n.li,{children:"All inherited from the ODS Tooltip component"}),`
`]}),`
`]}),`
`]}),`
`,t.jsx(e,{label:"Variation",level:2}),`
`,t.jsx(n.p,{children:t.jsx(n.strong,{children:"Internationalization (i18n)"})}),`
`,t.jsx(n.p,{children:"The Manage Text component supports the following languages: English, German, Spanish, French (default), Italian, Dutch, Polish and Portuguese."}),`
`,t.jsx(e,{label:"Accessiblity",level:2}),`
`,t.jsxs(n.p,{children:[t.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",t.jsx(n.strong,{children:t.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,t.jsx(c,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move focus to the text; The tooltip is displayed"}]}})]})}function U(o={}){const{wrapper:n}={...a(),...o.components};return n?t.jsx(n,{...o,children:t.jsx(s,{...o})}):s(o)}export{U as default};
