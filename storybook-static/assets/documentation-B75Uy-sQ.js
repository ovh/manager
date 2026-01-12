import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as c}from"./index-CxZaaWiZ.js";import{t as r}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as o}from"./ods-react60-0db41gCx.js";import{M as d,C as h}from"./index-CL-V2Rb5.js";import{T as i,O as x,A as p,a as m}from"./textarea.stories-BvrEItwb.js";import{B as j,H as n}from"./Heading-Dp8V83Mt.js";import{I as u,B as g}from"./IdentityCard-CYVr1ksx.js";import{C as a}from"./Canvas-BL9WnydK.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-DR2gF2hH.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Textarea-D6qUk_wE-C2UZKwoJ.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-XALsLafD.js";function l(t){const s={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...c(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{of:i,name:"Documentation"}),`
`,e.jsx(j,{of:i}),`
`,e.jsx(s.p,{children:e.jsxs(s.em,{children:["A ",e.jsx(s.strong,{children:"Textarea"})," component allows users to input and edit multiple lines of text."]})}),`
`,e.jsx(h,{of:x,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsxs(u,{aliases:["Text Box"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=53-11147",githubUrl:"@ovhcloud/ods-react",name:"Textarea",children:[e.jsxs(s.p,{children:["The ",e.jsx(s.strong,{children:"Textarea"})," component is used to capture and display multi-line text input from users."]}),e.jsx(s.p,{children:"It is typically used in forms where users need to provide detailed information, comments, or descriptions."})]}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(s.p,{children:["Use the ",e.jsx(s.strong,{children:"Textarea"})," component to allow users to enter multi-line text in forms, such as comments, messages, descriptions, or other detailed information."]}),`
`,e.jsxs(s.p,{children:["Ensure that the ",e.jsx(s.strong,{children:"Textarea"})," is appropriately sized for the expected input and provides clear guidance on what information is needed."]}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(g,{donts:["- Don't use a Textarea for short, single-line inputs. Use an Input instead","- Don't rely on a placeholder as a substitute for a proper label since it disappears once the user starts typing","- Don't disable resizing if users are expected to write long-form content and might need a larger view"],dos:["- Use a Textarea for inputs that may span multiple lines, such as comments, descriptions, or messages","- Always pair the Textarea with a label to clearly explain what is expected","- Use helper text to provide guidance or clarify formatting when needed","- Allow scrolling or resizing if users are likely to enter long text (based on use case)","- Use Textarea for a text longer than a single line"]}),`
`,e.jsx(n,{label:"Best Practices in Context",level:3}),`
`,e.jsx(s.p,{children:e.jsx(s.img,{src:"./base-assets/components/textarea/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Textarea"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Placeholder or textarea text"})}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Resize handler"})," - optional"]}),`
`]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Textarea"})," should be vertically aligned with other form components on a same page."]}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Textarea"})," can be hovered, focused, disabled, or set to read-only."]}),`
`,e.jsx(s.p,{children:"When disabled, the component cannot be focused or interacted with."}),`
`,e.jsxs(s.p,{children:["If the user types more text than the ",e.jsx(s.strong,{children:"Textarea"})," can display, a scrollbar appears to allow scrolling."]}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.strong,{children:"Textarea"})," supports native browser resizing, but it is not enabled by default."]}),`
`,e.jsx(n,{label:"Navigation",level:2}),`
`,e.jsx(n,{label:"Focus Management",level:3}),`
`,e.jsxs(s.p,{children:["When the ",e.jsx(s.strong,{children:"Textarea"})," is enabled, it can receive focus via keyboard interaction."]}),`
`,e.jsxs(s.p,{children:["A disabled ",e.jsx(s.strong,{children:"Textarea"})," cannot receive focus."]}),`
`,e.jsxs(s.p,{children:["A read-only ",e.jsx(s.strong,{children:"Textarea"})," can receive focus, allowing users to scroll and select content, but its content cannot be modified."]}),`
`,e.jsx(n,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Tab"})," moves focus to the ",e.jsx(s.strong,{children:"Textarea"}),"."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Shift"})," + ",e.jsx(s.code,{children:"Tab"})," moves focus to the previous focusable element."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Enter"})," creates a new line within the ",e.jsx(s.strong,{children:"Textarea"}),"."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Arrow"})," keys moves the caret within the text content."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Ctrl"})," + ",e.jsx(s.code,{children:"Arrow Left"})," / ",e.jsx(s.code,{children:"Arrow Right"})," (or ",e.jsx(s.code,{children:"Option"})," + ",e.jsx(s.code,{children:"Arrow Left"})," / ",e.jsx(s.code,{children:"Arrow Right"})," on macOS) moves the caret by word."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Home"})," / ",e.jsx(s.code,{children:"End"})," (or ",e.jsx(s.code,{children:"Cmd"}),"+ ",e.jsx(s.code,{children:"Arrow"})," keys on macOS) moves the caret to the beginning or end of the line."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Page Up"})," / ",e.jsx(s.code,{children:"Page Down"})," scrolls through the content if it's longer than the visible area."]}),`
`,e.jsx(n,{label:"Accessibility",level:2}),`
`,e.jsx(s.p,{children:"To ensure proper accessibility, it must be correctly labeled, and provide live updates if a character limit is set."}),`
`,e.jsx(n,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(s.p,{children:["Every ",e.jsx(s.strong,{children:"Textarea"}),` must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose,
using either `,e.jsx(s.strong,{children:"FormField"})," or a native label tag."]}),`
`,e.jsx(a,{of:p,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(r,{name:o.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label and the field."]}),`
`,e.jsx(n,{label:"Linking helper text",level:3}),`
`,e.jsx(a,{of:m,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(r,{name:o.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field and the helper text."]})]})}function V(t={}){const{wrapper:s}={...c(),...t.components};return s?e.jsx(s,{...t,children:e.jsx(l,{...t})}):l(t)}export{V as default};
