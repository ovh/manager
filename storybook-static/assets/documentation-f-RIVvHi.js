import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-XxUZGkLd.js";import{t as l}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as c}from"./ods-react60-0db41gCx.js";import{M as a,C as d}from"./index-a-pfv-Xa.js";import{B as h,H as o,E as p}from"./Heading-D2dEonqZ.js";import{S as t,O as m,A as x}from"./select.stories-S7N2zbLX.js";import{I as j,B as g}from"./IdentityCard-CKgUiqaN.js";import{C as u}from"./Canvas-Bjwxvbkq.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-DVaWS9ZP.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-lwTwL84Q.js";function i(s){const n={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:t,name:"Documentation"}),`
`,e.jsx(h,{of:t}),`
`,e.jsx(n.p,{children:e.jsxs(n.em,{children:[e.jsx(n.strong,{children:"Select"})," component is used to select one or more items from a list of values"]})}),`
`,e.jsx(d,{of:m,sourceState:"none"}),`
`,e.jsx(o,{label:"Overview",level:2}),`
`,e.jsx(j,{aliases:["Dropdown"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=49-24314",githubUrl:"@ovhcloud/ods-react",name:"Select",children:e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Select"})," is used to allow users to select one or more items from a list that is displayed after clicking on it."]})}),`
`,e.jsx(o,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Select"})," is used to display to the user a list of items or options to choose from."]}),`
`,e.jsx(n.p,{children:"The order of items or options in the list should be sorted as following, depending on the usage:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Frequency"})," of use: recommended item will be listed first"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Alpha"}),": it can be used for countries or city locations for example"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Numeric"}),": it can be used for sizes for example"]}),`
`]}),`
`,e.jsx(o,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(g,{donts:[`- Don't use a Select for binary choices like "Yes" or "No". Use Radio buttons instead for faster interaction`,"- Don't use Select when users need to compare all available options. Use Radio buttons for better visibility","- Don't include very long option labels that wrap multiple lines since it makes scanning and selection harder","- Don't rely only on placeholder text to communicate intent. Always pair Select with a label","- Don't overload Select with too many items (e.g., hundreds). Consider Combobox or a searchable alternative"],dos:["- Use a Select when users need to choose one option from a list of three or more items","- Order the options logically (e.g., by frequency of use, alphabetical order, or numeric sequence)","- Keep option labels short and scannable, ideally one word or a short phrase that fits on a single line","- Use placeholder text to prompt users when no option is selected","- Consider adding grouping if you have many related options and want to improve clarity"]}),`
`,e.jsx(o,{label:"Best Practices in Context",level:3}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"./base-assets/components/select/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Select"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Field containing placeholder or selection"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Dropdown"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"List"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Option"})}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Group"})," - optional"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Multi-selection"})," - optional (display a checkbox)"]}),`
`]}),`
`,e.jsx(o,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Select"})," should be vertically aligned with other form components on a same page."]}),`
`,e.jsx(n.p,{children:"It has a width by default, but it can widen to match its container."}),`
`,e.jsx(o,{label:"Behavior",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Select"})," can be focused and hovered. It also can be disabled. A single option and a group of options can be disabled to be more precise in inner ",e.jsx(n.strong,{children:"Select"})," items."]}),`
`,e.jsx(o,{label:"Variation",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Single selection"}),": Allows the user to select a single item from a dropdown list of options."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Multiple selection"}),": Allows the user to select multiple items from a dropdown list of options. The whole line is clickable."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Grouped options"}),": Related options can be grouped together in both a single and multi ",e.jsx(n.strong,{children:"Select"}),"."]}),`
`]}),`
`,e.jsx(o,{label:"Navigation",level:2}),`
`,e.jsx(o,{label:"Focus Management",level:3}),`
`,e.jsxs(n.p,{children:["When the ",e.jsx(n.strong,{children:"Select"})," is enabled, it can receive focus via keyboard interaction."]}),`
`,e.jsxs(n.p,{children:["When the ",e.jsx(n.strong,{children:"Select"})," is opened, focus moves into the dropdown content and highlights the selected option (if any), or the first available option."]}),`
`,e.jsxs(n.p,{children:["When closed, focus returns to the ",e.jsx(n.strong,{children:"Select"})," trigger."]}),`
`,e.jsxs(n.p,{children:["A read-only ",e.jsx(n.strong,{children:"Select"})," can receive focus, but the dropdown cannot be opened or interacted with."]}),`
`,e.jsxs(n.p,{children:["Disabled ",e.jsx(n.strong,{children:"Select"})," or disabled options cannot receive focus or be interacted with."]}),`
`,e.jsx(o,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Space"}),", ",e.jsx(n.code,{children:"Enter"}),", ",e.jsx(n.code,{children:"Arrow Down"})," or ",e.jsx(n.code,{children:"Arrow Up"})," when the ",e.jsx(n.strong,{children:"Select"})," is focused opens the dropdown and highlights the selected or first option."]}),`
`,e.jsx(n.p,{children:"While the dropdown is open:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Arrow Down"})," moves the highlight to the next option"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Arrow Up"})," moves the highlight to the previous option"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Enter"})," or ",e.jsx(n.code,{children:"Tab"})," selects the currently highlighted option and closes the dropdown"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Escape"})," closes the dropdown without making a new selection"]}),`
`]}),`
`,e.jsx(n.p,{children:"Typing an alphanumeric character (A–Z, a–z) changes focus to the next option starting with that character."}),`
`,e.jsx(o,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["This component complies with the ",e.jsx(p,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/listbox/",children:"Listbox WAI-ARIA design pattern"}),"."]}),`
`,e.jsx(o,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(n.p,{children:["Every ",e.jsx(n.strong,{children:"Select"}),` must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose,
using either `,e.jsx(n.strong,{children:"FormField"})," or a native label tag."]}),`
`,e.jsx(u,{of:x,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(l,{name:c.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label as well as the select."]})]})}function ee(s={}){const{wrapper:n}={...r(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(i,{...s})}):i(s)}export{ee as default};
