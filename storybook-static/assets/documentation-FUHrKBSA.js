import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-BbLPDwHm.js";import{S as r,a as s,b as a,e as t,c as d}from"./external-links-644LBWig.js";import{S as c}from"./index-DeW_46E-.js";import{M as h}from"./index-CKSIDW05.js";import m from"./update-name-modal.stories-8p9nvLau.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-DqxQzjvh.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./manager-react-components-lib.es-CB6a8vIK.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";function l(i){const n={a:"a",code:"code",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...o(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:"Manager React Components/Templates/Update Name Modal/Documentation"}),`
`,e.jsx(r,{of:m}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Update Name Modal"})," provides a user interface to rename items such as products, resources, or other entities."]}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(a,{aliases:["Rename Modal","Edit Name Modal"],githubUrl:t.github.updateNameModal,name:"Update Name Modal",relatedComponents:[{name:"ods-button",href:t.ods.button},{name:"ods-form-field",href:t.ods.formField},{name:"ods-message",href:t.ods.message},{name:"ods-modal",href:t.ods.modal},{name:"ods-input",href:t.ods.input},{name:"ods-text",href:t.ods.text}],children:e.jsx(n.p,{children:"It uses ODS Modal from OVHcloud Design System."})}),`
`,e.jsx(s,{label:"Anatomy",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Headline/Title"}),": a free-text as title"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Description"}),": a short explanatory text detailing the purpose of the modal"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ODS Form Field"}),":",`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Update Input Label"})," associated with the Input indicating the value the user must type to enable update"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"An ODS Input"}),": used for user validation"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Actions"})," including two buttons :",`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Cancel"}),": Closes the modal without, it trigger closeModal callback"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Confirm"}),": Executes the update dispaly name action; disabled by default and enabled only when the input value matches the expected text"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Close Button"}),": Inherited from the ODS Modal, allowing users to dismiss the modal"]}),`
`]}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.strong,{children:"Update Name Modal"})," for renaming entities like products, resources, or others elements requiring a display name."]}),`
`,e.jsx(s,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(d,{dos:["Do use the Update Name Modal for simple and straightforward renaming tasks","Do ensure the Input field is pre-filled with the current name","Do provide clear pattern messages when a specific naming format is required"],donts:["Do not use the Update Name Modal for unrelated editing tasks","Avoid using the Update Name Modal for operations requiring additional complex inputs or steps beyond renaming"]}),`
`,e.jsx(s,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Update Name Modal"}),' is triggered by a user action, such as clicking an "Edit" button associated with the entity to rename.']}),`
`,e.jsx(s,{label:"Api Service",level:2}),`
`,e.jsxs(n.p,{children:["A custom hook ",e.jsx(n.code,{children:"useUpdateServiceDisplayName"})," is implemented, ",e.jsx(n.a,{href:"/docs/hooks-useupdateservicename--technical-information",children:"here"})," the documentation"]}),`
`,e.jsx(s,{label:"Behaviour",level:2}),`
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
`,e.jsxs(n.li,{children:["Cancel: dismisses the modal, it can be trigger by ",e.jsx(n.code,{children:"onClose"})," callback"]}),`
`,e.jsxs(n.li,{children:["Confirm: when enabled, submits the updated name and closes the modal, it can beb trigger by ",e.jsx(n.code,{children:"updateDisplayName"})," callback"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Close Button"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The modal can also be dismissed by clicking the close button, inherited from the ODS Modal, , it trigger onClose callback"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(s,{label:"Variations",level:2}),`
`,e.jsxs(n.p,{children:["There is only one visual variation of the ",e.jsx(n.strong,{children:"Update Name Modal"}),", which uses the info color."]}),`
`,e.jsx(s,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(c,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move between interactive elements (Input, Buttons)"},{key:"Enter or Space while Action Menu is focused",interaction:"Activate the focused Button"},{key:"Escape",interaction:"Dismiss the modal"}]}})]})}function U(i={}){const{wrapper:n}={...o(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(l,{...i})}):l(i)}export{U as default};
