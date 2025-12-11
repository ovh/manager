import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-Q1c3vqG7.js";import{t as l}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as c}from"./ods-react60-0db41gCx.js";import{M as a,C as d}from"./index-DAHS-wil.js";import{C as s,O as p}from"./code.stories-BzBjDdNG.js";import{B as h,H as n}from"./Heading-C4IxIajs.js";import{I as m,B as x}from"./IdentityCard-RZ6xy6Df.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-Dhu224za.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Code-Bo0soTUb-Cbjvsa-n.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";function i(t){const o={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:s,name:"Documentation"}),`
`,e.jsx(h,{of:s}),`
`,e.jsx(o.p,{children:e.jsxs(o.em,{children:[e.jsx(o.strong,{children:"Code"})," component highlights strings or small blocks of ",e.jsx(o.strong,{children:"Code"})," so it makes them easier to read and understand"]})}),`
`,e.jsx(d,{of:p,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsx(m,{aliases:["Code snippet"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=26-7720",githubUrl:"@ovhcloud/ods-react",name:"Code",children:e.jsxs(o.p,{children:["A ",e.jsx(o.strong,{children:"Code"})," component displays a string of ",e.jsx(o.strong,{children:"Code"})," or a small block of ",e.jsx(o.strong,{children:"Code"})," that can be copied to the clipboard."]})}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(o.p,{children:[e.jsx(o.strong,{children:"Code"})," is mainly used for sharing examples of ",e.jsx(o.strong,{children:"Code"})," that can be a string or a small block of ",e.jsx(o.strong,{children:"Code"}),"."]}),`
`,e.jsxs(o.p,{children:["An optional icon ",e.jsx(o.strong,{children:"Button"})," may be added in order to copy its content."]}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(x,{donts:["- Don't use the Code component to display very long code blocks","- Don't use the Code component for non-code content","- Don't overload the UI with code examples in places where documentation would be clearer","- Don't use the component if the code can't be easily understood, reused, or copied","- Don't style code with custom formatting that breaks consistency (e.g., non-monospace fonts, shadows, etc.)"],dos:["- Use the Code component to display short and reusable code snippets (e.g., command lines, config)","- Make sure the code is readable and scannable, with appropriate syntax highlighting","- Use inline code within text blocks for single tokens","- Wrap multiline snippets in a block format only when necessary and still concise"]}),`
`,e.jsx(n,{label:"Best Practices in Context",level:3}),`
`,e.jsx(o.p,{children:e.jsx(o.img,{src:"./base-assets/components/code/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(o.ol,{children:[`
`,e.jsx(o.li,{children:e.jsx(o.strong,{children:"Code"})}),`
`,e.jsx(o.li,{children:e.jsx(o.strong,{children:"Content"})}),`
`,e.jsxs(o.li,{children:[e.jsx(o.strong,{children:"Copy button"})," - optional"]}),`
`,e.jsxs(o.li,{children:[e.jsx(o.strong,{children:"Tooltip"})," (when the copy button is displayed)"]}),`
`]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(o.p,{children:["By default, the ",e.jsx(o.strong,{children:"Code"})," content is left-aligned in its container."]}),`
`,e.jsx(o.p,{children:"It should be vertically aligned with other form components on a same page."}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsxs(o.p,{children:['The "Copy" icon ',e.jsx(o.strong,{children:"Button"})," can be hovered, focused and clicked."]}),`
`,e.jsxs(o.p,{children:["If the optional icon ",e.jsx(o.strong,{children:"Button"})," exists, when clicking on it, the ",e.jsx(o.strong,{children:"Code"})," content is copied to the user's clipboard."]}),`
`,e.jsx(o.p,{children:"Copy label and copy success label can be customized."}),`
`,e.jsx(n,{label:"Navigation",level:2}),`
`,e.jsx(n,{label:"Focus Management",level:3}),`
`,e.jsxs(o.p,{children:["The ",e.jsx(o.strong,{children:"Code"})," component itself is non-interactive and does not receive keyboard focus."]}),`
`,e.jsx(o.p,{children:'However, if the component includes a "Copy" action, the associated Copy button can be focused.'}),`
`,e.jsx(n,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(o.p,{children:["Pressing ",e.jsx(o.code,{children:"Tab"}),' moves focus to the "Copy" button if available.']}),`
`,e.jsxs(o.p,{children:["Pressing ",e.jsx(o.code,{children:"Enter"})," or ",e.jsx(o.code,{children:"Space"}),' while the "Copy" button is focused copies the code to the clipboard.']}),`
`,e.jsxs(o.p,{children:["Pressing ",e.jsx(o.code,{children:"Shift"})," + ",e.jsx(o.code,{children:"Tab"})," moves focus to the previous interactive element."]}),`
`,e.jsx(n,{label:"Accessibility",level:2}),`
`,e.jsxs(o.p,{children:[e.jsx(l,{name:c.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the embedded code and the copy button ",e.jsx(o.strong,{children:"Tooltip"})," content."]})]})}function Y(t={}){const{wrapper:o}={...r(),...t.components};return o?e.jsx(o,{...t,children:e.jsx(i,{...t})}):i(t)}export{Y as default};
