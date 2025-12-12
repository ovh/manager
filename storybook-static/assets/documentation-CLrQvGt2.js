import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-VTf1maKX.js";import{t as d}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as h}from"./ods-react60-0db41gCx.js";import{M as m,C as p}from"./index-C9O2ILSc.js";import{T as r,O as u,A as x}from"./timepicker.stories-BqqFmSSO.js";import{B as j,H as s}from"./Heading-CEB-7Vnd.js";import{I as f,B as g}from"./IdentityCard-VcIL-zvw.js";import{R as o,S as t,C as b}from"./Canvas-CBsyyVHs.js";import{S as l}from"./StorybookLink-B4nLTGFk.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-T2GtGINg.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./TimepickerTimezoneList-CRVzDFsF-DFLPqCJR.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-kZK0fati.js";function c(i){const n={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...a(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(m,{of:r,name:"Documentation"}),`
`,e.jsx(j,{of:r}),`
`,e.jsx(n.p,{children:e.jsxs(n.em,{children:["A ",e.jsx(n.strong,{children:"Timepicker"})," is a component that allows users to select a time from a list or set a specific time."]})}),`
`,e.jsx(p,{of:u,sourceState:"none"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(f,{aliases:["Time"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=53-11662",githubUrl:"@ovhcloud/ods-react",name:"Timepicker",children:e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Timepicker"})," component is used for selecting times in forms and applications. It provides an interface for users to choose a time, ensuring the format is consistent and valid. The component can include features like 12-hour or 24-hour formats, increments, and disabled times."]})}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Timepicker"})," is used to allow a selection of a specific time."]}),`
`,e.jsx(n.p,{children:"It is useful for scheduling such as planning a meeting."}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Timepicker"})," field includes the hour, minutes and optionally seconds. It can be followed by an AM/PM indicator."]}),`
`,e.jsx(n.p,{children:"For some use case, an optional timezone Select can be added to allow users to select their desired timezone from a list of options."}),`
`,e.jsx(s,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(g,{donts:["- Don't use a placeholder as a label since it disappears on input and fails accessibility standards","- Don't rely on a placeholder to convey critical information like format or timezone. This should be communicated through helper text or labels","- Don't use a Timepicker for ambiguous or unclear time selection use cases. Ensure it is the right fit for your form flow and user intent","- Don't expose all global timezones unless necessary"],dos:["- Use a Timepicker when users need to select a specific time, especially for scheduling or planning scenarios","- Always pair the Timepicker with a clear label and/or helper text","- Combine the Timepicker with a datepicker when both date and time selection are needed in the same context","- When offering timezone selection, provide a restricted and relevant list to avoid overwhelming users. Limit options based on business relevance or geography"]}),`
`,e.jsx(s,{label:"Best Practices in Context",level:3}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"./base-assets/components/timepicker/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Timepicker"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Input field"})}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Timezones select"})," - optional"]}),`
`]}),`
`,e.jsx(s,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Timepicker"})," can be used in a page as long as there is a need to allow users to pick a time."]}),`
`,e.jsx(n.p,{children:"The time field has a fixed width by default but, when used in a form, its width should match the other inputs."}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Timepicker"})," should be vertically aligned with other form components on a same page."]}),`
`,e.jsx(s,{label:"Behavior",level:2}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Timepicker"})," can widen to match its container (width of the elements is 50% each)."]}),`
`,e.jsxs(n.p,{children:["It has the same states and behaviors for each inner component (i.e. ",e.jsx(l,{kind:o.input,story:t.documentation,children:"Input"})," and ",e.jsx(l,{kind:o.select,story:t.documentation,children:"Select"}),")."]}),`
`,e.jsx(s,{label:"Navigation",level:2}),`
`,e.jsx(s,{label:"Focus Management",level:3}),`
`,e.jsxs(n.p,{children:["When the ",e.jsx(n.strong,{children:"Timepicker"})," is focused, the first focusable segment (typically the hour Input) receives focus automatically."]}),`
`,e.jsx(n.p,{children:"Focus then moves sequentially through the minute and second inputs (if present), followed by the AM/PM toggle (depending on the browser) and the optional timezone select."}),`
`,e.jsx(n.p,{children:"Each individual segment can receive focus and be navigated independently using the keyboard. If a segment (e.g., seconds or timezone) is not visible or disabled, it is skipped in the tab order."}),`
`,e.jsx(s,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Tab"})," moves focus forward through all focusable segments of the Timepicker:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Hour field"}),`
`,e.jsx(n.li,{children:"Minute field"}),`
`,e.jsx(n.li,{children:"Second field (if enabled)"}),`
`,e.jsx(n.li,{children:"AM/PM toggle (if 12-hour format)"}),`
`,e.jsx(n.li,{children:"Time zone Select (if present)"}),`
`]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Shift"})," + ",e.jsx(n.code,{children:"Tab"})," moves focus backward through the segments."]}),`
`,e.jsx(n.p,{children:"When focused on an input segment (hour, minute, second):"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Typing numeric values replaces the current value"}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Up"})," increments the value"]}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Down"})," decrements the value"]}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Backspace"})," clears the content"]}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Home"})," or ",e.jsx(n.code,{children:"fn"})," + ",e.jsx(n.code,{children:"Arrow Up"})," increases the value by:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"3 units for the hour segment"}),`
`,e.jsx(n.li,{children:"10 units for minutes and seconds"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"End"})," or ",e.jsx(n.code,{children:"fn"})," + ",e.jsx(n.code,{children:"Arrow Down"})," decreases the value by:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"3 units for the hour segment"}),`
`,e.jsx(n.li,{children:"10 units for minutes and seconds"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:"When focused on the AM/PM toggle:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Up"})," or ",e.jsx(n.code,{children:"Arrow Down"})," switches between AM and PM"]}),`
`]}),`
`,e.jsx(n.p,{children:"When focused on the timezone Select, keyboard shortcuts are similar to the Select component:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Space"})," or ",e.jsx(n.code,{children:"Arrow Down"})," opens the dropdown"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Arrow"})," keys navigate options"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Enter"})," or ",e.jsx(n.code,{children:"Tab"})," selects the option and closes the dropdown"]}),`
`,e.jsxs(n.li,{children:["Pressing ",e.jsx(n.code,{children:"Escape"}),"closes the dropdown"]}),`
`]}),`
`,e.jsx(s,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["To ensure proper accessibility, the ",e.jsx(n.strong,{children:"Timepicker"})," component must be correctly labeled."]}),`
`,e.jsx(s,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(n.p,{children:["Every ",e.jsx(n.strong,{children:"Timepicker"}),` must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose,
using either `,e.jsx(n.strong,{children:"FormField"})," or a native label tag."]}),`
`,e.jsx(b,{of:x,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(d,{name:h.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the input time and the select field."]})]})}function ce(i={}){const{wrapper:n}={...a(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(c,{...i})}):c(i)}export{ce as default};
