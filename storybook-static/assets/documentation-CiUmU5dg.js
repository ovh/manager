import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-44VTds2h.js";import{b as a,S as n,c as l,a as c,d as h}from"./index-DeEMO5vk.js";import{M as d,C as p}from"./index-CxmMwio3.js";import x,{Default as m}from"./ManagerText.stories-B3NWs1Oi.js";import{e as s}from"./external-links-Bni12-7h.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-g35VEYZr.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./manager-react-components-lib.es-BsqdnzGX.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";import"./iam.constants-DtqzYIv-.js";function i(o){const t={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Manager React Components/Components/Manager Text/Documentation"}),`
`,e.jsx(a,{of:x}),`
`,e.jsx(p,{layout:"centered",of:m,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsxs(l,{githubUrl:s.github.ManagerText,name:"ManagerText",relatedComponents:[{name:"ods-text",href:s.ods.text},{name:"ods-tooltip",href:s.ods.tooltip}],children:[e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Manager Text"})," component is a wrapper for OdsText with added capability to handle IAM behaviour to displays a text if the user has access to the data, otherwise display a message with a tooltip for additional context. It is designed for interactive usage, with mandatory URN and IAM actions properties to associate the text with external resources."]}),e.jsx(t.p,{children:"The component supports internationalization (i18n)."})]}),`
`,e.jsx(n,{label:"Anatomy",level:2}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"ODS Text"}),': it is restricited to the "span" preset; it serves as the trigger for the tooltip']}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"ODS Tooltip"}),": it displays contextual information about the text"]}),`
`]}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(t.p,{children:["Use the ",e.jsx(t.strong,{children:"Manager Text"})," to display the information requiring IAM check to display the text."]}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(c,{dos:["Do use the Manager Text for succinct, content requiring contextual explanations","Do provide valid URN and IAM actions"],donts:["Do not use the Manager Text for purely decorative purposes"]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Manager Text"})," component is typically used inline within a table, a paragraph, or alongside other UI elements where additional explanation is necessary."]}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsx(t.p,{children:e.jsx(t.strong,{children:"States"})}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Default"}),":",`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"The text is visible, and the tooltip is hidden by default"}),`
`]}),`
`]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Hover and focus"}),":",`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"All inherited from the ODS Tooltip component"}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"Interactions"}),`
Hovering or focusing over the text displays the tooltip.`]}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"URN"}),": links the text to an external resource."]}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"IAM actions"}),": related to IAM policies; One or more ",e.jsx(t.strong,{children:"actions"})," allowed or excepted by an IAM policy."]}),`
`,e.jsx(n,{label:"Variation",level:2}),`
`,e.jsx(t.p,{children:e.jsx(t.strong,{children:"Internationalization (i18n)"})}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Manage Text"})," component supports the following languages: English, German, Spanish, French (default), Italian, Dutch, Polish and Portuguese."]}),`
`,e.jsx(n,{label:"Accessiblity",level:2}),`
`,e.jsxs(t.p,{children:[e.jsx(t.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(t.strong,{children:e.jsx(t.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(h,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move focus to the text; The tooltip is displayed"}]}})]})}function O(o={}){const{wrapper:t}={...r(),...o.components};return t?e.jsx(t,{...o,children:e.jsx(i,{...o})}):i(o)}export{O as default};
