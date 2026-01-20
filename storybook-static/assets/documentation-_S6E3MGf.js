import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as c}from"./index-BnJ4eeZE.js";import{t as r}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as i}from"./ods-react60-0db41gCx.js";import{M as d,C as p}from"./index-Ck5q0c5c.js";import{I as o,O as h,A as u,a as m}from"./input.stories-ConqNTtY.js";import{B as x,H as n}from"./Heading-CUt9y0bY.js";import{I as j,B as g}from"./IdentityCard-DKtxsaXB.js";import{C as a}from"./Canvas-BnlgT6BS.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-bAznjRtu.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-DX7gpv7E.js";function l(s){const t={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...c(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{of:o,name:"Documentation"}),`
`,e.jsx(x,{of:o}),`
`,e.jsx(t.p,{children:e.jsxs(t.em,{children:[e.jsx(t.strong,{children:"Input"})," component is an ",e.jsx(t.strong,{children:"Input"})," field where users can type into"]})}),`
`,e.jsx(p,{of:h,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsx(j,{aliases:["Text Input","Text Field"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=93-22570",githubUrl:"@ovhcloud/ods-react",name:"Input",children:e.jsxs(t.p,{children:["An ",e.jsx(t.strong,{children:"Input"})," is used to allow the user to enter a single line information in a field."]})}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(t.p,{children:["An ",e.jsx(t.strong,{children:"Input"})," is used to type a free-form short text in a field. It is often used within a Form Field component that adds its label."]}),`
`,e.jsx(t.p,{children:"It is commonly used in a form, such as asking the user their name or email address, data entered can be text or numbers."}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Input"})," component can be used in addition with an ",e.jsx(t.strong,{children:"Autocomplete"}),"."]}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(g,{donts:["- Don't use an Input for multi-line content, use a Textarea instead","- Don't use an Input when users must choose from a predefined set of answers. Prefer Select, Combobox, or Radio","- Don't leave an Input without a label","- Don't overload the Input with multiple embedded actions (e.g., clear + search + toggle) since it creates visual clutter","- Don't use an Input that is inappropriately sized for its content"],dos:["- Always pair the Input with a clear and explicit label, using the Form Field component for example","- Provide a helper message or validation feedback below the Input when appropriate (e.g., expected format or error state)","- Use the clearable button option when it helps users reset the field quickly and efficiently","- Use the toggle mask button for sensitive inputs to let users show or hide the content","- Include a search button within the Input if a specific action is expected (e.g., triggering a search)","- Choose the appropriate input type (email, password, search, etc.) to support native validation"]}),`
`,e.jsx(n,{label:"Best Practices in Context",level:3}),`
`,e.jsx(t.p,{children:e.jsx(t.img,{src:"./base-assets/components/input/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsx(t.li,{children:e.jsx(t.strong,{children:"Input"})}),`
`,e.jsx(t.li,{children:e.jsx(t.strong,{children:"Placeholder or input text"})}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Clearable button"})," - optional"]}),`
`]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"Input"})," should be vertically aligned with other form components on a same page."]}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"Inputs"})," that are strongly related in a form can be grouped. This group can flow horizontally left to right and/or vertically top to bottom."]}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"Inputs"})," can be hovered, focused and clicked / triggered. They can be disabled or readonly as well."]}),`
`,e.jsxs(t.p,{children:["The user can start typing in the ",e.jsx(t.strong,{children:"Input"})," after clicking or focusing on the field container."]}),`
`,e.jsxs(t.p,{children:["A clearable button can be displayed within the ",e.jsx(t.strong,{children:"Input"})," to clear its content. This button becomes visible as soon as the user types the first character and removes all content when clicked."]}),`
`,e.jsxs(t.p,{children:["A toggle mask button can be displayed within the ",e.jsx(t.strong,{children:"Input"})," to toggle the visibility of its content, such as revealing or hiding a password in a masked input."]}),`
`,e.jsxs(t.p,{children:["A search button can be displayed within the ",e.jsx(t.strong,{children:"Input"})," to trigger a specific action, such as performing a search."]}),`
`,e.jsx(n,{label:"Navigation",level:2}),`
`,e.jsx(n,{label:"Focus Management",level:3}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Input"})," field receives focus as part of the natural tab order."]}),`
`,e.jsxs(t.p,{children:["If a clear button is present, it becomes focusable immediately after the ",e.jsx(t.strong,{children:"Input"})," field."]}),`
`,e.jsx(t.p,{children:"If a toggle mask button (show/hide password) is present, it becomes focusable after the clear button."}),`
`,e.jsxs(t.p,{children:["If a search button is present, it becomes focusable after the other ",e.jsx(t.strong,{children:"Input"})," action buttons."]}),`
`,e.jsxs(t.p,{children:["If the ",e.jsx(t.strong,{children:"Input"})," field is read-only, it can still receive focus but cannot be edited."]}),`
`,e.jsxs(t.p,{children:["If the ",e.jsx(t.strong,{children:"Input"})," is disabled, it is  skipped in the tab order and cannot be edited."]}),`
`,e.jsx(n,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(t.p,{children:["Pressing ",e.jsx(t.code,{children:"Tab"})," moves focus forward."]}),`
`,e.jsxs(t.p,{children:["Pressing ",e.jsx(t.code,{children:"Shift"})," + ",e.jsx(t.code,{children:"Tab"})," moves focus backward to the previous interactive element."]}),`
`,e.jsxs(t.p,{children:["Typing any character while the ",e.jsx(t.strong,{children:"Input"})," field is focused enters text into the field."]}),`
`,e.jsxs(t.p,{children:["Pressing ",e.jsx(t.code,{children:"Backspace"})," deletes the character preceding the cursor."]}),`
`,e.jsxs(t.p,{children:["Pressing ",e.jsx(t.code,{children:"Enter"})," while a clear, toggle mask, or search button is focused triggers the corresponding action."]}),`
`,e.jsx(n,{label:"Accessibility",level:2}),`
`,e.jsxs(t.p,{children:["To ensure proper accessibility, the ",e.jsx(t.strong,{children:"Input"})," component must be correctly labeled and provide meaningful context when interactive elements (such as icon buttons) are used."]}),`
`,e.jsx(n,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(t.p,{children:["Every ",e.jsx(t.strong,{children:"Input"}),` must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose,
using either `,e.jsx(t.strong,{children:"FormField"})," or a native label tag."]}),`
`,e.jsx(a,{of:u,sourceState:"shown"}),`
`,e.jsxs(t.p,{children:[e.jsx(r,{name:i.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field and its content."]}),`
`,e.jsx(n,{label:"Override action context",level:3}),`
`,e.jsx(t.p,{children:"To provide more context on the interactive elements, you can provide your own custom translations to the component."}),`
`,e.jsx(a,{of:m,sourceState:"shown"}),`
`,e.jsxs(t.p,{children:[e.jsx(r,{name:i.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field, its content and custom label of focused action."]})]})}function ee(s={}){const{wrapper:t}={...c(),...s.components};return t?e.jsx(t,{...s,children:e.jsx(l,{...s})}):l(s)}export{ee as default};
