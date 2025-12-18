import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-BjQHK-Oi.js";import{t as a}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l}from"./ods-react60-0db41gCx.js";import{M as c,C as d}from"./index-DThejhUn.js";import{P as n,O as p,A as m}from"./progress-bar.stories-CcYYa_69.js";import{B as g,H as r,E as h}from"./Heading-B0W0XnI0.js";import{I as u,B as x}from"./IdentityCard-DW_r5_-c.js";import{C as j}from"./Canvas-BJzRjL-W.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-6yjxaTqs.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ProgressBar-DyF6GCp5-C0AeSb5S.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-Dn0Jgxxy.js";function t(o){const s={em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...i(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{of:n,name:"Documentation"}),`
`,e.jsx(g,{of:n}),`
`,e.jsx(s.p,{children:e.jsx(s.em,{children:"A horizontal bar indicating the current completion status of a long-running task, usually updated continuously as the task progresses, instead of in discrete steps."})}),`
`,e.jsx(d,{of:p,sourceState:"none"}),`
`,e.jsx(r,{label:"Overview",level:2}),`
`,e.jsx(u,{aliases:["Progress","Progress Loader","Preloader","Loading Bar","Progress Indicator"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=49-8976",githubUrl:"@ovhcloud/ods-react",name:"Progress Bar",children:e.jsxs(s.p,{children:["The ",e.jsx(s.strong,{children:"Progress Bar"}),` component is used to indicate the progress of a task or process to users. It visually
represents the completion percentage, providing users with feedback on the status of ongoing operations, such as
file uploads, downloads, or form submissions.`]})}),`
`,e.jsx(r,{label:"Usage",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Progress Bar"})," component is only used in process progression, such as submitting, uploading or saving items."]}),`
`,e.jsx(r,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(x,{donts:["- Don't use a Progress Bar to visualize static data or compare values, use a chart or graph instead","- Don't display all three labels (start value, end value, current value) at the same time","- Don't rely solely on color to communicate progress, include text or value where helpful","- Don't use Progress Bar for instantaneous actions where progress feedback is not meaningful, use a spinner instead"],dos:["- Use a Progress Bar to represent linear, quantifiable progression in processes like uploads or submissions","- Prefer Progress Bar when the completion state is measurable (e.g. 0–100%), and users benefit from visual feedback on progress","- Use clear labels or indicators (like percentage or step descriptions) if it adds clarity to the task","- Pair the Progress Bar with contextual messaging to clarify what is being processed and what happens next"]}),`
`,e.jsx(r,{label:"Best Practices in Context",level:3}),`
`,e.jsx(s.p,{children:e.jsx(s.img,{src:"./base-assets/components/progress-bar/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Progress Bar"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Track"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Progress fill"})}),`
`]}),`
`,e.jsx(r,{label:"Placement",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Progress Bar"})," is usually centered in its container, and can be stretched to match the container width if necessary."]}),`
`,e.jsx(r,{label:"Behavior",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Progress Bar"})," is filled from the minimum to the maximum value, depending on the progress described."]}),`
`,e.jsx(r,{label:"Navigation",level:2}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.strong,{children:"Progress Bar"})," component is non-interactive and does not receive keyboard focus. It is purely visual and used to indicate progress status without affecting keyboard navigation."]}),`
`,e.jsx(r,{label:"Accessibility",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Progress Bar"})," component should be properly identified and structured to ensure it is accessible to assistive technologies."]}),`
`,e.jsx(r,{label:"Linking the Progress Bar to loading details",level:3}),`
`,e.jsxs(s.p,{children:["To ensure the ",e.jsx(s.strong,{children:"Progress Bar"})," is correctly recognized, an ",e.jsx(h,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",children:"aria-label"})," should be added to explicitly identify it."]}),`
`,e.jsx(j,{of:m,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(a,{name:l.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the value and the progress bar."]})]})}function J(o={}){const{wrapper:s}={...i(),...o.components};return s?e.jsx(s,{...o,children:e.jsx(t,{...o})}):t(o)}export{J as default};
