import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as c}from"./index-BgWqaNhW.js";import{t as o}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as r}from"./ods-react60-0db41gCx.js";import{M as d,C as h}from"./index-BFzAcuM3.js";import{P as i,O as p,A as m,a as u}from"./password.stories-muvLf3uI.js";import{B as x,H as n}from"./Heading-BJY1CP7a.js";import{I as j,B as f}from"./IdentityCard-DZBiPMNp.js";import{R as g,S as b,C as a}from"./Canvas-C0itSVU5.js";import{S as w}from"./StorybookLink-Cm0vXja_.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-DxxJ0EuQ.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./Password-BRnIsw22-DCVt4F6o.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-CvUaUdhv.js";function l(t){const s={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...c(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{of:i,name:"Documentation"}),`
`,e.jsx(x,{of:i}),`
`,e.jsx(s.p,{children:e.jsxs(s.em,{children:[e.jsx(s.strong,{children:"Password"})," component is an ",e.jsx(w,{kind:g.input,story:b.documentation,children:"Input"})," field for entering a password that can be hidden or not."]})}),`
`,e.jsx(h,{of:p,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsx(j,{aliases:["Password field","Password input"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=48-4526",githubUrl:"@ovhcloud/ods-react",name:"Password",children:e.jsxs(s.p,{children:["The ",e.jsx(s.strong,{children:"Password"}),` component is an Input field of which the content is replaced with middle dot symbol symbols "·" by default and
the masking can be toggled using a show/hide action.`]})}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(s.p,{children:["A ",e.jsx(s.strong,{children:"Password"})," is mainly used to let users enter a password or secret information."]}),`
`,e.jsx(s.p,{children:"Entered password can be masked or visible as plain text when users need to check what they have entered."}),`
`,e.jsx(s.p,{children:"It can also be used for displaying tokens."}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(f,{donts:["- Don't use the Password component when users need to see what they're typing by default, use a standard Input instead","- Don't hide the label. Users should always know what the Password field is for","- Don't use Passwords for non-sensitive or public information; this could cause unnecessary friction","- Don't rely only on placeholders to communicate password requirements","- Don't remove the toggle visibility option unless there is a strong security or UX reason to do so"],dos:["- Use the Password component for sensitive inputs, such as login credentials, tokens, or API keys","- Use the read-only mode for displaying generated tokens or credentials that users may need to copy, without editing","- Pair Password fields with clear labels and helper texts for expected format or complexity requirements"]}),`
`,e.jsx(n,{label:"Best Practices in Context",level:3}),`
`,e.jsx(s.p,{children:e.jsx(s.img,{src:"./base-assets/components/password/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Password"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Placeholder or input text"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Show/Hide button"})}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Clearable button"})," - optional"]}),`
`]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Password"})," should be vertically aligned with other form components on a same page."]}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Password"})," can be used in read-only mode, especially for displaying sensitive tokens."]}),`
`,e.jsx(s.p,{children:"Users can toggle the password masking (show/hide) by clicking an action button. The selected visibility state remains until the user clicks again."}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Password"})," supports a clear action to quickly reset its content."]}),`
`,e.jsx(s.p,{children:"A loading state can be displayed inside the field when needed, for example during validation or processing."}),`
`,e.jsx(n,{label:"Navigation",level:2}),`
`,e.jsx(n,{label:"Focus Management",level:3}),`
`,e.jsx(s.p,{children:"When tabbing through the page, the Password field receives focus as part of the natural tab order."}),`
`,e.jsx(s.p,{children:"If present, the clear button is focusable immediately after the Password field."}),`
`,e.jsx(s.p,{children:"If present, the toggle mask button (show/hide password) is focusable after the clear button."}),`
`,e.jsx(s.p,{children:"If the Password field is read-only, it can still receive focus but cannot be edited."}),`
`,e.jsx(n,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Tab"})," moves focus forward."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Shift"})," + ",e.jsx(s.code,{children:"Tab"})," moves focus backward to the previous interactive element."]}),`
`,e.jsx(s.p,{children:"Pressing any character key while the Password field is focused enters text into the field (unless it is read-only)."}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Backspace"})," deletes the last character before the cursor position."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Enter"})," while the clear button is focused clears the Password content."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Enter"})," while the toggle mask button is focused toggles between showing and hiding the field content."]}),`
`,e.jsx(n,{label:"Accessibility",level:2}),`
`,e.jsxs(s.p,{children:["To ensure proper accessibility, the ",e.jsx(s.strong,{children:"Password"})," component must be correctly labeled and provide meaningful context when interactive elements (such as icon buttons) are used."]}),`
`,e.jsx(n,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(s.p,{children:["Every ",e.jsx(s.strong,{children:"Password"})," must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose, using either ",e.jsx(s.strong,{children:"FormField"})," or a native label tag."]}),`
`,e.jsx(a,{of:m,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(o,{name:r.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field and its content."]}),`
`,e.jsx(n,{label:"Override action context",level:3}),`
`,e.jsx(s.p,{children:"To provide more context on the interactive elements, you can provide your own custom translations to the component."}),`
`,e.jsx(a,{of:u,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(o,{name:r.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the field, its content and custom label of focused action."]})]})}function re(t={}){const{wrapper:s}={...c(),...t.components};return s?e.jsx(s,{...t,children:e.jsx(l,{...t})}):l(t)}export{re as default};
