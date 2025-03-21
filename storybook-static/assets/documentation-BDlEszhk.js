import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-CyBtB0VZ.js";import{S as r,a as t,b as a,c as l}from"./index-CGb183dP.js";import{S as c}from"./index-C8qn7uCY.js";import{M as d,C as h}from"./index-IIISP0qU.js";import x,{Default as p}from"./ManagerText.stories-DNGozvM3.js";import"./index-Bnop-kX6.js";import"./index-C7RZ_VRQ.js";import"./index-vm89uYmh.js";import"./index-4pTrEEYx.js";import"./iframe-Bg1V8O6K.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ManagerText-C2kCZ4V1.js";import"./i18next-DdipboBq.js";import"./useOvhIam-4UIu5qrD.js";import"./QueryClientProvider-Y_fKerI5.js";import"./useTranslation-I4D8sCWp.js";function s(o){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...i(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Components/Manager Text/Documentation"}),`
`,e.jsx(r,{of:x}),`
`,e.jsx(h,{layout:"centered",of:p,sourceState:"none"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsxs(a,{aliases:["Manager Text"],atomicType:"",figmaLink:"",githubUrl:"",name:"Manager Text",relatedComponents:[{name:"link"}],children:[e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Manager Text"})," component displays a text with a tooltip for additional context. It is designed for interactive usage, with mandatory URN and IAM actions properties to associate the text with external resources."]}),e.jsx(n.p,{children:"The component supports internationalization (i18n)."})]}),`
`,e.jsx(t,{label:"Anatomy",level:2}),`
`,e.jsx(n.p,{children:"add the image here"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ODS Text"}),': it is restricited to the "span" preset; it serves as the trigger for the tooltip']}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ODS Tooltip"}),": it displays contextual information about the text"]}),`
`]}),`
`,e.jsx(t,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.strong,{children:"Manager Text"})," to display a concise text requiring additional explanation via a tooltip."]}),`
`,e.jsx(t,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(l,{dos:["Do use the Manager Text for succinct, (inline?) content requiring contextual explanations","Do provide valid URN and IAM actions"],donts:["Do not use the Manager Text for purely decorative purposes"]}),`
`,e.jsx(t,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Manager Text"})," component is typically used inline within a table (a paragraph?), or alongside other UI elements where additional explanation is necessary."]}),`
`,e.jsx(t,{label:"Behavior",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"States"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Default"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The text is visible, and the tooltip is hidden by default"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Hover and focus"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"All inherited from the ODS Tooltip component"}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Interactions"}),`
Hovering or focusing over the text displays the tooltip.`]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"URN"}),": links the text to an external resource."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"IAM actions"}),": related to IAM policies; One or more ",e.jsx(n.strong,{children:"actions"})," allowed or excepted by an IAM policy."]}),`
`,e.jsx(t,{label:"Variation",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Internationalization (i18n)"})}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Manage Text"})," component supports the following languages: English (default?), German, Spanish, French, Italian, Dutch, Polish and Portuguese."]}),`
`,e.jsx(t,{label:"Accessiblity",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(c,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move focus to the text; The tooltip is displayed"}]}})]})}function R(o={}){const{wrapper:n}={...i(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(s,{...o})}):s(o)}export{R as default};
