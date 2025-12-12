import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as d}from"./index-VTf1maKX.js";import{t as a}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as t}from"./ods-react60-0db41gCx.js";import{M as h,C as u}from"./index-C9O2ILSc.js";import{B as m,H as s,E as r}from"./Heading-CEB-7Vnd.js";import{R as l,O as p,A as g,a as x}from"./range.stories-p9FSFyR4.js";import{I as j,B as b}from"./IdentityCard-VcIL-zvw.js";import{C as o}from"./Canvas-CBsyyVHs.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-T2GtGINg.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Range-CfZeXvJr-C-szzAQ1.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./index-kZK0fati.js";function c(i){const n={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...d(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(h,{of:l,name:"Documentation"}),`
`,e.jsx(m,{of:l}),`
`,e.jsx(n.p,{children:e.jsxs(n.em,{children:[e.jsx(n.strong,{children:"Range"})," component is used to allow users to visually select one or more values from a range of values by moving the handle along a bar"]})}),`
`,e.jsx(u,{of:p,sourceState:"none"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsxs(j,{aliases:["Slider"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=49-16052",githubUrl:"@ovhcloud/ods-react",name:"Range",children:[e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Range"})," component is used for selecting a numerical value or a range of values within a specified range."]}),e.jsx(n.p,{children:"It provides a visual and interactive way to adjust values, often used in forms, settings, and data filtering."}),e.jsx(n.p,{children:"The component can support single-value sliders or dual-handle sliders for selecting ranges."})]}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Range"})," is used to select a numeric value within a given range with defined minimum and maximum values."]}),`
`,e.jsx(n.p,{children:"It is easily adjustable in a visually pleasing interface and, after interacting with it, changes are reflected immediately."}),`
`,e.jsxs(n.p,{children:["A dual ",e.jsx(n.strong,{children:"Range"})," allows the user to select a numeric range value that is no less than a given value, and no more than another given value."]}),`
`,e.jsx(s,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(b,{donts:["- Don't overload a page with too many Range components","- Don't place a Range in tight or constrained spaces where the control becomes hard to use or interpret","- Don't use a continuous Range for large intervals where precision is important. Use a discrete step Range or typed input instead","- Don't omit labels or helper text"],dos:["- Use a Range component when users need to select a value (or values) within a defined numeric interval","- Label the Range clearly using a Form Field to indicate what the value represents","- Provide a default value or starting range to guide users and avoid ambiguity","- Use a dual Range when allowing users to set a minimum and maximum value","- Make sure the Range has enough horizontal space to be usable and legible"]}),`
`,e.jsx(s,{label:"Best Practices in Context",level:3}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"./base-assets/components/range/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Range"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Track"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Min/Max values"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Handle"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Active fill"})}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Second handle"})," - optional (Dual Range)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tick marks"})," - optional"]}),`
`]}),`
`,e.jsx(s,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Range"})," can be used in a page as long as there is a need to allow users to select a numeric value within a given range, for a quantity or a volume for example."]}),`
`,e.jsx(n.p,{children:"It has a width by default, but it can widen to match its container."}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Range"})," can also be used inside components."]}),`
`,e.jsx(n.p,{children:"It also can be combined with other elements such as an input for a better control of the value selection."}),`
`,e.jsx(s,{label:"Behavior",level:2}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Range"})," can be focused and hovered. It also can be disabled."]}),`
`,e.jsx(n.p,{children:"The user can select a numeric value by clicking and dragging the thumb along the track."}),`
`,e.jsx(s,{label:"Navigation",level:2}),`
`,e.jsx(s,{label:"Focus Management",level:3}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Range"})," component can be focused. Focus will land on the first thumb if multiple are present."]}),`
`,e.jsx(n.p,{children:"When multiple thumbs are used, each thumb can receive focus individually."}),`
`,e.jsxs(n.p,{children:["Disabled ",e.jsx(n.strong,{children:"Range"})," and disabled thumbs cannot be focused or interacted with."]}),`
`,e.jsx(s,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Right"})," or ",e.jsx(n.code,{children:"Arrow Up"})," increases the value of the focused thumb by one step."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Left"})," or ",e.jsx(n.code,{children:"Arrow Down"})," decreases the value of the focused thumb by one step."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Page Up"})," or ",e.jsx(n.code,{children:"Shift"})," + ",e.jsx(n.code,{children:"Arrow Right"})," increases the value by a larger step."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Page Down"})," or ",e.jsx(n.code,{children:"Shift"})," + ",e.jsx(n.code,{children:"Arrow Down"})," decreases the value by a larger step."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Home"})," or ",e.jsx(n.code,{children:"fn"})," + ",e.jsx(n.code,{children:"Arrow Left"})," sets the value to the minimum."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"End"})," or ",e.jsx(n.code,{children:"fn"})," + ",e.jsx(n.code,{children:"Arrow Right"})," sets the value to the maximum."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Tab"})," and ",e.jsx(n.code,{children:"Shift"})," + ",e.jsx(n.code,{children:"Tab"})," allow navigation between multiple thumbs (if present)."]}),`
`,e.jsx(s,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["This component complies with the ",e.jsx(r,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/slider/",children:"Slider"})," and ",e.jsx(r,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/",children:"Slider (Multi-Thumb)"})," WAI-ARIA design patterns."]}),`
`,e.jsx(s,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(n.p,{children:["Every ",e.jsx(n.strong,{children:"Range"}),` must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose,
using either `,e.jsx(n.strong,{children:"FormField"})," or a native label tag."]}),`
`,e.jsx(o,{of:g,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(a,{name:t.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the value, the slider and its label."]}),`
`,e.jsx(s,{label:"Always provide a descriptive sub-label in Dual Range",level:3}),`
`,e.jsxs(n.p,{children:[`Sub-label provide additional context about the values that are selected or adjusted by the user. This sub-label should be vocalized by screen readers.
Use `,e.jsx(r,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",children:"aria-labelledby"})," to link the sub-label and ",e.jsx(r,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions",children:'aria-live="polite"'})," to ensure that the content is vocalized by screen readers."]}),`
`,e.jsx(o,{of:x,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(a,{name:t.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the values, the slider and its label."]})]})}function Y(i={}){const{wrapper:n}={...d(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(c,{...i})}):c(i)}export{Y as default};
