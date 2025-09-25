import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-DMscLk_r.js";import{S as l,a as t,b as a,e as s,c}from"./external-links-DBXiLeNy.js";import{M as d,C as h}from"./index-KONHwz82.js";import p,{DefaultProps as x}from"./filters.stories-CWfKgdui.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-D56x9By5.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-Dn_KRD1v.js";import"./manager-react-components-lib.es-CBd9Txn3.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";function o(i){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Manager React Components/Components/Filters/Documentation"}),`
`,e.jsx(l,{of:p}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Filters"}),' component provides an "interface" to create and manage filters using a combination of user inputs and predefined conditions.']}),`
`,e.jsx(h,{of:x,sourceState:"none"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsxs(a,{aliases:["Filters tags","Search Filters"],githubUrl:s.github.filters,name:"Filters",relatedComponents:[{name:"odsDatepicker",href:s.ods.datepicker},{name:"odsFormField",href:s.ods.formField},{name:"odsInput",href:s.ods.input},{name:"odsSelect",href:s.ods.select},{name:"odsTag",href:s.ods.tag}],children:[e.jsx(n.p,{children:"It facilitates:"}),e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"adding filter tags directly via the main Input and Button"}),`
`,e.jsx(n.li,{children:"adding more complexe filters through a Menu (Button + Popover)"}),`
`]})]}),`
`,e.jsx(t,{label:"Anatomy",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Input"}),": ODS Input; Allows the user to type a search term"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Button"})," (magnifying glass icon): ODS Button; Triggers the addition of a tag base on the Input field value"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Button"})," (filter icon): ODS Button; Opens an ODS Popover for advanced filter creation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Popover"}),": ODS Popover; Contains the following form elements:"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Actions"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"An ODS Select"}),": for choosing the field to filter on (e.g., column)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"A second ODS Select"}),': for choosing a filetring condition (e.g., "contains", "starts with")']}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"An ODS Input"}),": for specifying the value to filter by"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"An ODS Button"}),": for submitting the form elements and adding a filter tag"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tag(s)"}),": ODS Tag; Display the added filters and allow removal"]}),`
`]}),`
`,e.jsx(t,{label:"Usage",level:2}),`
`,e.jsx(c,{dos:["Do use Filter component to enhance user experience in data exploration and management interfaces","Do ensure proper configuration of Select options and Input fields to align with the application's requirements"],donts:["Do not use the Filter component if tagging functionnality or advanced filtering is unnecessary","Avoid overcomplicating the Popover with unrelated controls or logic"]}),`
`,e.jsx(t,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Filter"})," component is typically placed above or alongside a Datagrid or data display interface."]}),`
`,e.jsx(n.p,{children:"It should be easily accessible to users for quick filtering actions."}),`
`,e.jsx(t,{label:"Behavior",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"States"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Default"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The Input and Buttons are ready for user interactions"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Hover, focus, click"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"All inherited from the OVHcloud Design System components"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Interactions"})}),`
`,e.jsx(n.p,{children:"Direct Input filtering"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"User types a value into the Input field"}),`
`,e.jsx(n.li,{children:"User clicks the Button (magnifying-glass icon)"}),`
`,e.jsx(n.li,{children:"A tag is added below the Input field"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Advanced filtering (via Popover)"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"User clicks the Button (filter icon) to open the Popover"}),`
`,e.jsxs(n.li,{children:["In the Popover:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"user selects an option in the first Select"}),`
`,e.jsx(n.li,{children:"user selects a condition in the second Select"}),`
`,e.jsx(n.li,{children:"user types a value into the Input field"}),`
`,e.jsx(n.li,{children:"the Button to submit becomes enabled"}),`
`]}),`
`]}),`
`,e.jsx(n.li,{children:'User clicks the Button "add", and a tag is added below the Input field'}),`
`,e.jsx(n.li,{children:"The Popover remains open for additional filter creation"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Tag removal"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Clicking the tag deletes it"}),`
`]}),`
`,e.jsx(t,{label:"Variation",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Locale and language"})}),`
`,e.jsx(n.p,{children:`The labels in the Popover (e.g., "Column", "Condition", "Value", "Add") are (or can be) localized to match the application's language.`}),`
`,e.jsx(t,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(n.p,{children:"To meet accessibility standards:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Ensure all form elements in the Popover have clear and descriptive labels"}),`
`,e.jsx(n.li,{children:"Users should be able to navigate through the Input, Buttons, and Popover elements using keyboard controls"}),`
`]})]})}function O(i={}){const{wrapper:n}={...r(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(o,{...i})}):o(i)}export{O as default};
