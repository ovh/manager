import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-CyBtB0VZ.js";import{S as o,a as i,b as r,c as a}from"./index-CGb183dP.js";import{M as c,C as d}from"./index-IIISP0qU.js";import h,{DefaultProps as p}from"./filters.stories-DbWpY_1N.js";import"./index-Bnop-kX6.js";import"./index-C7RZ_VRQ.js";import"./index-vm89uYmh.js";import"./index-4pTrEEYx.js";import"./iframe-Bg1V8O6K.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-DJAo1xlC.js";import"./index-DHSIHcaZ.js";import"./useColumnFilters-DGJVzBm2.js";import"./useTranslation-I4D8sCWp.js";import"./i18next-DdipboBq.js";function s(t){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...l(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Components/Filters/documentation"}),`
`,e.jsx(o,{of:h}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Filters"}),' component provides an "interface" to create and manage filters using a combination of user inputs and predefined conditions.']}),`
`,e.jsx(d,{of:p,sourceState:"none"}),`
`,e.jsx(i,{label:"Overview",level:2}),`
`,e.jsxs(r,{aliases:["Filters tags","Search Filters"],atomicType:"",figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=1-6634",githubUrl:"https://github.com/ovh/design-system/tree/master/packages/ods/src/components/accordion",name:"Filters",relatedComponents:[{name:"link"}],children:[e.jsx(n.p,{children:"It facilitates:"}),e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"adding filter tags directly via the main Input and Button"}),`
`,e.jsx(n.li,{children:"adding more complexe filters through a Menu (Button + Popover) → ce composant pourrait exister côté MRC peut-être ? réutilisable 3 fois, just an idea (smile)"}),`
`,e.jsx(n.li,{children:"managing filters dynamically, including removing tags as needed"}),`
`]})]}),`
`,e.jsx(i,{label:"Anatomy",level:2}),`
`,e.jsx(n.p,{children:"add the image here"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Input"}),": ODS Input; Allows the user to type a search term"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Button"})," (magnifying glass icon): ODS Button; Triggers the addition of a tag base on the Input field value"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Button"})," (filter icon): ODS Button; Opens an ODS Popover for advanced filter creation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Popover"}),": ODS Popover; Contains the following form elements:"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Actions"})," including two buttons (is this part only functional?):",`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"An ODS Select"}),": for choosing the filed to filter on (e.g., column)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"A second ODS Select"}),': for choosing a filetring condition (e.g., "contains", "starts with")']}),`
`,e.jsx(n.li,{children:"AN ODS Input: for specifying the value to filter by"}),`
`,e.jsx(n.li,{children:"AN ODS Button: for submitting the form elements and adding a filter tag"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tag(s)"}),": ODS Tag; Display the added filters and allow removal"]}),`
`]}),`
`,e.jsx(i,{label:"Usage",level:2}),`
`,e.jsx(a,{dos:["Do use Filter component to enhance user experience in data exploration and management interfaces","Do ensure proper configuration of Select options and Input fields to align with the application's requirements"],donts:["Do not use the Filter component if tagging functionnality or advanced filtering is unnecessary","Avoid overcomplicating the Popover with unrelated controls or logic"]}),`
`,e.jsx(i,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Filter"})," component is typically placed above or alongside a Datagrid or data display interface."]}),`
`,e.jsx(n.p,{children:"It should be easily accessible to users for quick filtering actions."}),`
`,e.jsx(i,{label:"Behavior",level:2}),`
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
`,e.jsx(n.p,{children:"**Interactions"}),`
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
`,e.jsx(i,{label:"Variation",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Locale and language"})}),`
`,e.jsx(n.p,{children:`The labels in the Popover (e.g., "Column", "Condition", "Value", "Add") are (or can be) localized to match the application's language?`}),`
`,e.jsx(i,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(n.p,{children:"To meet accessibility standards:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Ensure all form elements in the Popover have clear and descriptive labels"}),`
`,e.jsx(n.li,{children:"Users should be able to navigate through the Input, Buttons, and Popover elements using keyboard controls"}),`
`,e.jsx(n.li,{children:"aria-expanded for the Menu (on its trigger) ?"}),`
`]})]})}function O(t={}){const{wrapper:n}={...l(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{O as default};
