import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-VTf1maKX.js";import{M as a,C as l}from"./index-C9O2ILSc.js";import{C as o,O as c}from"./checkbox.stories-DpZz09Hf.js";import{B as h,H as s,E as d}from"./Heading-CEB-7Vnd.js";import{I as x,B as p}from"./IdentityCard-VcIL-zvw.js";import"./index-Bnop-kX6.js";import"./iframe-T2GtGINg.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./ods-react60-0db41gCx.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";function i(t){const n={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:o,name:"Documentation"}),`
`,e.jsx(h,{of:o}),`
`,e.jsx(n.p,{children:e.jsxs(n.em,{children:[e.jsx(n.strong,{children:"Checkbox"})," are used for a list of options where the user may make a choice by selecting multiple options, including all or none."]})}),`
`,e.jsx(l,{of:c,sourceState:"none"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(x,{aliases:["Checkbox Button (previous name)","Check Box","Tick Box"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=3-28514",githubUrl:"@ovhcloud/ods-react",name:"Checkbox",children:e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Checkbox"}),` are used to make a choice that must be confirmed by submitting a form. For an instantaneous choice
(without submit), the use of a switch is preferred (see Switch).`]})}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Checkbox"})," can be used in forms and containers."]}),`
`,e.jsx(n.p,{children:"Also, it can serve as :"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Selecting/deselecting item(s)"}),`
`,e.jsx(n.li,{children:"Lists/sub-lists"}),`
`,e.jsx(n.li,{children:"Filters"}),`
`,e.jsx(n.li,{children:"Agreement to terms and conditions"}),`
`]}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Checkbox"})," group is used for a list of options where the user may make a choice by selecting multiple options, including all or none."]}),`
`,e.jsx(s,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(p,{donts:["- Don't use a Checkbox if the user can only select one option, use a Radio Group instead","- Don't truncate labels with ellipsis","- Don't place Checkboxes too close together, maintain sufficient spacing to prevent selection errors",`- Don't use Checkboxes for binary actions like "save" or "submit", use a Button instead`],dos:["- Use clear, concise, and descriptive labels to explain what the Checkbox controls","- Allow labels to wrap to multiple lines when necessary, readability is more important than keeping to one line here","- Group related Checkboxes using a fieldset with a legend to provide context when applicable","- Use Checkboxes when multiple selections are allowed within a group of options"]}),`
`,e.jsx(s,{label:"Best Practices in Context",level:3}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"./base-assets/components/checkbox/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Checkbox"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Label"})}),`
`]}),`
`,e.jsx(s,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Checkbox"})," can be autonomous, as it can be labelled in a starting/ending text."]}),`
`,e.jsx(n.p,{children:"It can be inserted in containers or next to an external item."}),`
`,e.jsx(s,{label:"Behavior",level:2}),`
`,e.jsxs(n.p,{children:["The default behavior is that when clicking on the ",e.jsx(n.strong,{children:"Checkbox"})," or its linked label, the ",e.jsx(n.strong,{children:"Checkbox"})," is alternatively selected or deselected depending on the previous state."]}),`
`,e.jsxs(n.p,{children:["The indeterminate state is used only when the ",e.jsx(n.strong,{children:"Checkbox"})," contains a sub-list of selections that are partially selected."]}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Checkbox"})," can be in an error state, but also in a disabled state."]}),`
`,e.jsx(s,{label:"Navigation",level:2}),`
`,e.jsx(s,{label:"Focus Management",level:3}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Checkbox"})," component can receive keyboard focus and is part of the standard tab order."]}),`
`,e.jsxs(n.p,{children:["If the ",e.jsx(n.strong,{children:"Checkbox"})," is disabled, it does not receive focus and cannot be activated via keyboard."]}),`
`,e.jsx(s,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Space"})," toggles the ",e.jsx(n.strong,{children:"Checkbox"})," state (checked/unchecked)."]}),`
`,e.jsx(s,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["This component complies with the ",e.jsx(d,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/checkbox",children:"Checkbox WAI-ARIA design pattern"}),"."]}),`
`,e.jsxs(n.p,{children:["Vertical spacing of at least ",e.jsx(n.code,{children:"8px"})," between each checkbox is advised to provide sufficient tactile and visual separation."]})]})}function H(t={}){const{wrapper:n}={...r(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(i,{...t})}):i(t)}export{H as default};
