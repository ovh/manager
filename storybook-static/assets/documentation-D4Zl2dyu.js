import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as h}from"./index-BgWqaNhW.js";import{t as o}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as i}from"./ods-react60-0db41gCx.js";import{M as d,C as g}from"./index-BFzAcuM3.js";import{T as r,O as m,A as p,a as x}from"./toggle.stories-C5gbLhvN.js";import{B as u,H as n,E as l}from"./Heading-BJY1CP7a.js";import{I as j,B as f}from"./IdentityCard-DZBiPMNp.js";import{C as a}from"./Canvas-C0itSVU5.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-DxxJ0EuQ.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./ToggleLabel-CsN97R7O-CgXQCfWb.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-CvUaUdhv.js";function c(t){const s={code:"code",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...h(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{of:r,name:"Documentation"}),`
`,e.jsx(u,{of:r}),`
`,e.jsx(g,{of:m,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsxs(j,{aliases:["Toggle Switch","Switch"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=53-15319",githubUrl:"@ovhcloud/ods-react",name:"Toggle",children:[e.jsxs(s.p,{children:["The ",e.jsx(s.strong,{children:"Toggle"})," component is used to enable or disable a state, setting or feature."]}),e.jsx(s.p,{children:`It provides a clear visual indication of the current state and allows users to change states with a single click or
tap.`}),e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Toggles"})," are commonly used in settings, preferences, and forms where a binary choice is required."]})]}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(s.p,{children:["A ",e.jsx(s.strong,{children:"Toggle"})," is commonly used for binary choice."]}),`
`,e.jsx(s.p,{children:"The user can decide to switch between two states with an immediate effect visible at a glance."}),`
`,e.jsx(s.p,{children:"It can be used in following use cases when you need to allow the user to:"}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:"turn an option or settings on or off"}),`
`,e.jsx(s.li,{children:"add or remove an item or an option"}),`
`]}),`
`,e.jsxs(s.p,{children:["A ",e.jsx(s.strong,{children:"Toggle"})," should never require users to press a button to apply their settings (if a setting requires a button, use a checkbox instead)."]}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(f,{donts:["- Don't use a Toggle for changes that only take effect after form submission. Use a Checkbox instead","- Don't use ambiguous or overly long labels","- Don't use Toggle for multi-state or complex options since it is meant for binary (on/off) interactions only"],dos:["- Use a Toggle to switch between two states when the change has an immediate effect (e.g., turning a setting on or off)",'- Ensure the Toggle label clearly describes the "on" state, so users understand what enabling it will do',"- Place any related elements (e.g., changes triggered by the Toggle) close to the Toggle to reinforce the connection visually","- Use Toggle in mobile-friendly settings where quick, touch-based interactions are expected","- Use Toggle in forms only when the change takes effect immediately and does not require submission to apply"]}),`
`,e.jsx(n,{label:"Best Practices in Context",level:3}),`
`,e.jsx(s.p,{children:e.jsx(s.img,{src:"./base-assets/components/toggle/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Toggle"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Handle"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Track"})}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"State label"})," - optional"]}),`
`]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(s.p,{children:["Place the ",e.jsx(s.strong,{children:"Toggle"})," component near the setting or feature it controls."]}),`
`,e.jsx(s.p,{children:"It should be positioned within forms, settings panels, or any relevant context where a binary choice is required."}),`
`,e.jsx(s.p,{children:"Ensure it is easily accessible and visible."}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsxs(s.p,{children:["When the user clicks on a ",e.jsx(s.strong,{children:"Toggle"}),", it has an immediate effect:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsx(s.li,{children:'set to "on" position, the thumb will slide to the right of the track'}),`
`,e.jsx(s.li,{children:'set to "off" position, the thumb will slide to the left of the track'}),`
`]}),`
`,e.jsx(n,{label:"Navigation",level:2}),`
`,e.jsx(n,{label:"Focus Management",level:3}),`
`,e.jsxs(s.p,{children:["When the ",e.jsx(s.strong,{children:"Toggle"})," component is focused, focus is automatically set to the ",e.jsx(s.strong,{children:"Toggle"})," itself."]}),`
`,e.jsxs(s.p,{children:["A disabled ",e.jsx(s.strong,{children:"Toggle"})," cannot receive focus and cannot be toggled."]}),`
`,e.jsx(n,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Tab"})," moves focus to the ",e.jsx(s.strong,{children:"Toggle"})," component."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Shift"})," + ",e.jsx(s.code,{children:"Tab"})," moves focus backward to the previous focusable element."]}),`
`,e.jsxs(s.p,{children:["When focused, pressing ",e.jsx(s.code,{children:"Space"})," or ",e.jsx(s.code,{children:"Enter"})," immediately changes the ",e.jsx(s.strong,{children:"Toggle"}),"'s state from on to off or off to on."]}),`
`,e.jsx(n,{label:"Accessibility",level:2}),`
`,e.jsxs(s.p,{children:["This component complies with the ",e.jsx(l,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/checkbox",children:"Checkbox WAI-ARIA design pattern"}),"."]}),`
`,e.jsx(n,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(s.p,{children:["Every ",e.jsx(s.strong,{children:"Toggle"}),` must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose,
using either a `,e.jsx(s.strong,{children:"ToggleLabel"})," or an ",e.jsx(l,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",children:"aria-label"})," for context."]}),`
`,e.jsx(a,{of:p,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(o,{name:i.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce a checkbox, its state and the label."]}),`
`,e.jsx(a,{of:x,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(o,{name:i.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce a checkbox, its state and the label."]})]})}function Z(t={}){const{wrapper:s}={...h(),...t.components};return s?e.jsx(s,{...t,children:e.jsx(c,{...t})}):c(t)}export{Z as default};
