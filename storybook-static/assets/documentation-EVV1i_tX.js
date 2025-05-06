import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-C0P_pv5W.js";import{S as r,a as l,e as i,b as d}from"./external-links-C0uaN6zp.js";import{S as n}from"./index-KKKwZM4W.js";import{S as c}from"./index-DeW_46E-.js";import{M as p,C as h}from"./index-yTL-fKUs.js";import u,{Default as m}from"./ManagerButton.stories-C6VtGn_A.js";import"./index-Bnop-kX6.js";import"./index-CYx7_Ein.js";import"./index-w9OafIJF.js";import"./index-4pTrEEYx.js";import"./ods-toggle2-B24SOLJO.js";import"./iframe-j4hyuRIi.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ManagerButton-YVLoDttU.js";import"./i18next-6HYnolD1.js";import"./useOvhIam-4UIu5qrD.js";import"./QueryClientProvider-Y_fKerI5.js";import"./useTranslation-DQ7TG6Ul.js";import"./context-BG98Yt4t.js";function s(o){const e={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...a(),...o.components};return t.jsxs(t.Fragment,{children:[t.jsx(p,{title:"Components/Manager Button/Documentation"}),`
`,t.jsx(r,{of:u}),`
`,t.jsx(h,{layout:"centered",of:m,sourceState:"none"}),`
`,t.jsx(n,{label:"Overview",level:2}),`
`,t.jsx(l,{githubUrl:i.github.managerButton,name:"ManagerButton",relatedComponents:[{name:"ods-button",href:i.ods.button},{name:"ods-tooltip",href:i.ods.tooltip}],children:t.jsxs(e.p,{children:["The ",t.jsx(e.strong,{children:"Manager Button"}),` component is a wrapper for OdsButton that provides an additional capability of disabled Button with an optional
Tooltip for additional context if user does not have access to perform the associated action. It is designed to support actions or events,
with optional URN and IAM actions properties to associate the Tooltip content
with external resources. The component supports internationalization (i18n).`]})}),`
`,t.jsx(n,{label:"Anatomy",level:2}),`
`,t.jsxs(e.ol,{children:[`
`,t.jsxs(e.li,{children:[t.jsx(e.strong,{children:"ODS Button"}),": it is always disabled with customizable label; it serves as the trigger for the Tooltip"]}),`
`,t.jsxs(e.li,{children:[t.jsx(e.strong,{children:"ODS Tooltip"})," (optional): it displays contextual information about the disabled Button; can be omitted if no Tooltip is needed"]}),`
`]}),`
`,t.jsx(n,{label:"Usage",level:2}),`
`,t.jsxs(e.p,{children:["Use the ",t.jsx(e.strong,{children:"Manager Button"})," to provide users with a disabled button display a concise text requiring additional explanation via a tooltip."]}),`
`,t.jsx(n,{label:"Dos & Don'ts",level:2}),`
`,t.jsx(d,{dos:["Do use the Manager Button for succinct, content requiring contextual explanations","Do provide valid URN and IAM actions"],donts:["Do not use the Manager Button for purely decorative purposes"]}),`
`,t.jsx(n,{label:"Placement",level:2}),`
`,t.jsxs(e.p,{children:["The ",t.jsx(e.strong,{children:"Manager Button"})," component is typically used inline within a table, or alongside other UI elements where additional explanation is necessary."]}),`
`,t.jsx(n,{label:"Behavior",level:2}),`
`,t.jsx(e.p,{children:t.jsx(e.strong,{children:"States"})}),`
`,t.jsxs(e.ul,{children:[`
`,t.jsxs(e.li,{children:[t.jsx(e.strong,{children:"Default"}),":",`
`,t.jsxs(e.ul,{children:[`
`,t.jsx(e.li,{children:"The text is visible, and the tooltip is hidden by default"}),`
`]}),`
`]}),`
`,t.jsxs(e.li,{children:[t.jsx(e.strong,{children:"Hover and focus"}),":",`
`,t.jsxs(e.ul,{children:[`
`,t.jsx(e.li,{children:"All inherited from the ODS Tooltip component"}),`
`]}),`
`]}),`
`]}),`
`,t.jsx(n,{label:"Variation",level:2}),`
`,t.jsx(e.p,{children:t.jsx(e.strong,{children:"Internationalization (i18n)"})}),`
`,t.jsx(e.p,{children:"The Manage Text component supports the following languages: English, German, Spanish, French (default), Italian, Dutch, Polish and Portuguese."}),`
`,t.jsx(n,{label:"Accessiblity",level:2}),`
`,t.jsxs(e.p,{children:[t.jsx(e.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",t.jsx(e.strong,{children:t.jsx(e.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,t.jsx(c,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move focus to the text; The tooltip is displayed"}]}})]})}function z(o={}){const{wrapper:e}={...a(),...o.components};return e?t.jsx(e,{...o,children:t.jsx(s,{...o})}):s(o)}export{z as default};
