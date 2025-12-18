import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as d}from"./index-BjQHK-Oi.js";import{t as i}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as a}from"./ods-react60-0db41gCx.js";import{M as m,C as h}from"./index-DThejhUn.js";import{M as l,O as p,A as u,a as x,b}from"./meter.stories-RBvvuCaG.js";import{B as j,H as s,E as n}from"./Heading-B0W0XnI0.js";import{I as f,B as v}from"./IdentityCard-DW_r5_-c.js";import{C as o}from"./Canvas-BJzRjL-W.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-6yjxaTqs.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Meter-Q4oNu6aG-BjjvBiEL.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-Dn0Jgxxy.js";function c(r){const t={img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...d(),...r.components};return e.jsxs(e.Fragment,{children:[e.jsx(m,{of:l,name:"Documentation",tags:["new"]}),`
`,e.jsx(j,{of:l}),`
`,e.jsx(h,{of:p,sourceState:"none"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(f,{aliases:[],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/branch/YdqCQ0e4CtGBm7dLbuLl1h/ODS---UI-Kit?node-id=10494-5637&t=9pIeofapdgMDhhF4-0",githubUrl:"@ovhcloud/ods-react",name:"Meter",startingVersion:19,children:e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Meter"})," component visually represents a quantitative value within a defined range."]})}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Meter"}),` component represents a quantitative value such as resource usage, storage availability, or other bounded metrics.
It is distinct from a progress bar due to its focus on measurement and thresholds rather than progress toward a goal.`]}),`
`,e.jsxs(t.p,{children:["Additionally, the ",e.jsx(t.strong,{children:"Meter"})," is primarily static, representing a fixed state or measurement, whereas the progress bar is dynamic, reflecting continuous updates or progress over time."]}),`
`,e.jsx(s,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(v,{donts:["Don't use a Meter to represent unbounded progress (use a progress bar instead)","Avoid separating the Meter and its associated value across different sections of the UI to prevent confusion","Avoid excessive customization that compromises readability or accessibility"],dos:["- Use the Meter to represent bounded measurements, such as disk usage or CPU load","- Customize thresholds and colors to provide meaningful visual cues","- Include appropriate labels when context is not immediately clear"]}),`
`,e.jsx(s,{label:"Best Practices in Context",level:3}),`
`,e.jsx(t.p,{children:e.jsx(t.img,{src:"./base-assets/components/meter/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsx(t.li,{children:e.jsx(t.strong,{children:"Meter"})}),`
`,e.jsx(t.li,{children:e.jsx(t.strong,{children:"Track"})}),`
`,e.jsx(t.li,{children:e.jsx(t.strong,{children:"Fill"})}),`
`]}),`
`,e.jsx(s,{label:"Placement",level:2}),`
`,e.jsxs(t.p,{children:["The placement of the ",e.jsx(t.strong,{children:"Meter"})," depends on its use case and the context within the UI."]}),`
`,e.jsxs(t.p,{children:["Place the ",e.jsx(t.strong,{children:"Meter"})," close to the element it represents (e.g., near a resource title)."]}),`
`,e.jsxs(t.p,{children:["If the ",e.jsx(t.strong,{children:"Meter"}),' is tied to a specific numeric value (e.g., "75% used"), display the value nearby for clarity, directly adjacent to the component.']}),`
`,e.jsx(t.p,{children:"Include appropriate labels when context is not immediately clear:"}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"inline: labels can be placed above, below or beside the Meter."}),`
`,e.jsx(t.li,{children:"surrounding: labels for minimum and maximum values can be positioned at opposite ends of the track, as needed."}),`
`,e.jsx(t.li,{children:"hidden: for visual-only representation."}),`
`]}),`
`,e.jsx(s,{label:"Behavior",level:2}),`
`,e.jsxs(t.p,{children:[`Value representation supports minimum, maximum, and current value inputs.
The filled portion of the `,e.jsx(t.strong,{children:"Meter"})," is dynamically adjusted based on the value."]}),`
`,e.jsx(t.p,{children:`Low and high thresholds can be specified to visually indicate important ranges.
Color will change based on those thresholds.`}),`
`,e.jsxs(t.p,{children:[`The coloring behavior may be updated through the optimum attribute.
See the `,e.jsx(n,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meter#optimum",children:"optimum documentation"})," for more information."]}),`
`,e.jsx(s,{label:"Navigation",level:2}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Meter"})," component is non-interactive and does not receive keyboard focus."]}),`
`,e.jsx(s,{label:"Accessibility",level:2}),`
`,e.jsxs(t.p,{children:["To ensure proper accessibility, ",e.jsx(t.strong,{children:"Meter"})," must be correctly labeled."]}),`
`,e.jsx(s,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(t.p,{children:["Every ",e.jsx(t.strong,{children:"Meter"}),` must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose,
using either an `,e.jsx(n,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",children:"aria-label"}),`
or an `,e.jsx(n,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",children:"aria-labelledby"})," attribute."]}),`
`,e.jsx(o,{of:u,sourceState:"shown"}),`
`,e.jsxs(t.p,{children:[e.jsx(i,{name:a.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label and the meter information."]}),`
`,e.jsx(o,{of:x,sourceState:"shown"}),`
`,e.jsxs(t.p,{children:[e.jsx(i,{name:a.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label and the meter information."]}),`
`,e.jsx(s,{label:"Improve value readability",level:3}),`
`,e.jsxs(t.p,{children:[`Numbers aren't always user-friendly.
You can use the `,e.jsx(n,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-valuetext",children:"aria-valuetext"}),`
attribute to present the current value in a more user-friendly, human-understandable way.`]}),`
`,e.jsx(o,{of:b,sourceState:"shown"}),`
`,e.jsxs(t.p,{children:[e.jsx(i,{name:a.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label and the meter information in a more user-friendly, human-understandable way."]})]})}function J(r={}){const{wrapper:t}={...d(),...r.components};return t?e.jsx(t,{...r,children:e.jsx(c,{...r})}):c(r)}export{J as default};
