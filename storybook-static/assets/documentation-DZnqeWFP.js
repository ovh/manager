import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-BkrqZoHw.js";import{S as o,a as i,b as r,c as a}from"./index-CPUQJEMu.js";import{S as d}from"./index-C8qn7uCY.js";import{M as c}from"./index-44Ewvqs0.js";import h from"./delete-modal.stories-Dilo-X6J.js";import"./index-Bnop-kX6.js";import"./index-CpQqcCyD.js";import"./index-fg_2TIFA.js";import"./index-4pTrEEYx.js";import"./iframe-DsLLCrTq.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./delete-modal.component-BraChuFD.js";import"./click-utils-ByCElPrV.js";import"./i18next-DdipboBq.js";import"./useTranslation-I4D8sCWp.js";function s(t){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...l(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{title:"Templates/Delete Modal/Documentation"}),`
`,e.jsx(o,{of:h}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Delete Modal"})," is a confirmation dialog designed to prevent accidental deletions by requiring explicit user interaction. It extends the ODS Modal by adding a validation mechanism through an input field."]}),`
`,e.jsx(i,{label:"Overview",level:2}),`
`,e.jsxs(r,{aliases:["Confirmation Modal"],atomicType:"",figmaLink:"",githubUrl:"",name:"DeleteModal",relatedComponents:[{name:"link"}],children:[e.jsx(n.p,{children:"Key features include:"}),e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Validation via a required input field before the deletion action is enabled"}),`
`,e.jsx(n.li,{children:"Visual emphasis on the severity of the action using a warning color"}),`
`,e.jsx(n.li,{children:"A dismissible interface with Cancel and Confirm/Delete buttons"}),`
`,e.jsx(n.li,{children:"Feedback for loading states to prevent duplicate actions or interruptions?"}),`
`]})]}),`
`,e.jsx(i,{label:"Anatomy",level:2}),`
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
`,e.jsx(i,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.strong,{children:"Delete Modal"})," whenever a destructive action like deleting a resource requires explicit user confirmation."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Delete Modal"})," is Ideal for scenarios where additional user validation is necessary to ensure intentionality."]}),`
`,e.jsx(i,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(a,{dos:["Do provide clear and concise instructions in the description and input label","Do ensure the expected input value is prominently displayed in the input label","Do handle loading states gracefully to prevent duplicate submissions"],donts:["Do not use the Delete Modal if simpler confirmation mechanisms (e.g., a dialog box or confirmation button) suffice","Avoid overloading the Delete Modal with unnecessary information or actions"]}),`
`,e.jsx(i,{label:"Placement",level:2}),`
`,e.jsx(n.p,{children:"The Delete Modal is invoked as an overlay, centered on the page."}),`
`,e.jsx(n.p,{children:"It blocks interaction with the underlying content until the modal is dismissed or an action is confirmed."}),`
`,e.jsx(i,{label:"Behaviour",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"States"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Default:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Input field is enabled"}),`
`,e.jsx(n.li,{children:"Confirm/Delete button is disabled until the correct value is entered"}),`
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
`,e.jsx(n.li,{children:"Confirm/Delete button is disabled and shows a spinner indicating the loading state"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Interactions"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Input:"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The input field is used to validate the user's intent by requiring them to type a specific value"}),`
`,e.jsxs(n.li,{children:["If the input value matches the expected value:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The Confirm/Delete button transitions from disabled to enabled"}),`
`]}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Buttons"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Cancel: dismisses the modal without performing any action (pas géré par MRC?)"}),`
`,e.jsx(n.li,{children:"Confirm/Delete: Executes the delete action only when enabled (pas géré par MRC?)"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Close Button"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The modal can also be dismissed by clicking the close button, inherited from the ODS Modal"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(i,{label:"Variations",level:2}),`
`,e.jsxs(n.p,{children:["There is only one visual variation of the ",e.jsx(n.strong,{children:"Delete Modal"}),", which uses the warning color. This color emphasizes the importance and severity of the action."]}),`
`,e.jsx(i,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(d,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move between interactive elements (Input, Buttons"},{key:"Enter or Space while Action Menu is focused",interaction:"Activate the focused Button"},{key:"Escape",interaction:"Dismiss the modal"}]}})]})}function S(t={}){const{wrapper:n}={...l(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{S as default};
