import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-CyBtB0VZ.js";import{S as r,a as t,b as o,c as a}from"./index-CGb183dP.js";import{S as d}from"./index-C8qn7uCY.js";import{M as c}from"./index-IIISP0qU.js";import h from"./update-name-modal.stories-D3-iEi5G.js";import"./index-Bnop-kX6.js";import"./index-C7RZ_VRQ.js";import"./index-vm89uYmh.js";import"./index-4pTrEEYx.js";import"./iframe-Bg1V8O6K.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./update-name-modal.component-BSOXbJDk.js";import"./click-utils-ByCElPrV.js";import"./i18next-DdipboBq.js";import"./useTranslation-I4D8sCWp.js";function i(s){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...l(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Templates/Update Name Modal/Documentation"}),`
`,e.jsx(r,{of:h}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Update Name Modal"})," provides a user interface to rename items such as products, resources, or other entities."]}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsx(o,{aliases:["Rename Modal","Edit Name Modal"],atomicType:"",figmaLink:"",githubUrl:"",name:"Update Name Modal",relatedComponents:[{name:"Modal"},{name:"Button"},{name:"Input"},{name:"Form-field"}],children:e.jsx(n.p,{children:"It uses ODS Modal from OVHcloud Design System."})}),`
`,e.jsx(t,{label:"Anatomy",level:2}),`
`,e.jsx(n.p,{children:"TODO: add img"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Headline/Title"}),": a free-text as title"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Description"}),": a short explanatory text detailing the purpose of the modal"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ODS Form Field"}),":",`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Delete Input Label"})," associated with the Input indicating the value the user must type to enable deletion"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"An ODS Input"}),": used for user validation"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Actions"})," including two buttons (is this part only functional?):",`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Cancel"}),": Closes the modal without any action (l'intégrateur doit le faire lui même?)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Confirm/Delete"}),": Executes the deletion action; disabled by default and enabled only when the input value matches the expected text"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Close Button"}),": Inherited from the ODS Modal, allowing users to dismiss the modal (toujours possible de dismiss la ",e.jsx(n.strong,{children:"Delete Modal"}),"?)"]}),`
`]}),`
`,e.jsx(t,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.strong,{children:"Update Name Modal"})," for renaming entities like products, resources, or others elements requiring a display name."]}),`
`,e.jsx(t,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(a,{dos:["Do use the Update Name Modal for simple and straightforward renaming tasks","Do ensure the Input field is pre-filled with the current name","Do provide clear pattern messages when a specific naming format is required"],donts:["Do not use the Update Name Modal for unrelated editing tasks that require multiple fields?","Avoid using the Update Name Modal for operations requiring additional complex inputs or steps beyond renaming"]}),`
`,e.jsx(t,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Update Name Modal"}),' is triggered by a user action, such as clicking an "Edit" button associated with the entity to rename.']}),`
`,e.jsx(t,{label:"Behaviour",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"States"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Default:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The Modal opens with the Input pre-filled with the old/current name"}),`
`,e.jsx(n.li,{children:"Confirm button is disabled and it remains disabled until a new name is entered in the Input field"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Hover, focus, click:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"All inherited from the OVHcloud Design System components"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Loading:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Input field is disabled to prevent further interaction"}),`
`,e.jsx(n.li,{children:"Confirm button is disabled and shows a spinner indicating the loading state"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Interactions"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Input:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"User edits the name in the Input field"}),`
`,e.jsx(n.li,{children:"If the Input value does not match the predefined pattern, the confirm Button remains disabled, and the pattern message guides the user"}),`
`,e.jsx(n.li,{children:"When a valid new name is entered, the confirm button becomes enabled and clickable"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Buttons"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Cancel: dismisses the modal without performing any action (pas géré par MRC mais à la charge de l'intégrateur?)"}),`
`,e.jsx(n.li,{children:"Confirm: when enabled, submits the updated name and closes the modal (pas géré par MRC mais à la charge de l'intégrateur?)"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Close Button"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The modal can also be dismissed by clicking the close button, inherited from the ODS Modal"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(t,{label:"Variations",level:2}),`
`,e.jsxs(n.p,{children:["There is only one visual variation of the ",e.jsx(n.strong,{children:"Update Name Modal"}),", which uses the info color."]}),`
`,e.jsx(t,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(d,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move between interactive elements (Input, Buttons)"},{key:"Enter or Space while Action Menu is focused",interaction:"Activate the focused Button"},{key:"Escape",interaction:"Dismiss the modal"}]}})]})}function A(s={}){const{wrapper:n}={...l(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(i,{...s})}):i(s)}export{A as default};
