import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as d}from"./index-Q1c3vqG7.js";import{t as r}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as o}from"./ods-react60-0db41gCx.js";import{M as h,C as g}from"./index-DAHS-wil.js";import{M as a,O as m,A as u,a as p,b as x}from"./message.stories-a5iGKtc9.js";import{B as j,H as n,E as l}from"./Heading-C4IxIajs.js";import{I as f,B as v}from"./IdentityCard-RZ6xy6Df.js";import{C as i}from"./Canvas-BUqQNO43.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-Dhu224za.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-C1gQJPyk.js";function c(t){const s={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...d(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(h,{of:a,name:"Documentation"}),`
`,e.jsx(j,{of:a}),`
`,e.jsx(s.p,{children:e.jsxs(s.em,{children:[e.jsx(s.strong,{children:"Message"})," component helps to communicate with users providing feedback or information."]})}),`
`,e.jsx(g,{of:m,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsxs(f,{aliases:["Notifier","Notification","Banner","Alert","Feedback"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=44-8300",githubUrl:"@ovhcloud/ods-react",name:"Message",children:[e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Message"})," component communicates information to the user."]}),e.jsx(s.p,{children:"It grabs the user's attention in a prominent way."})]}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Messages"})," are used as notification status."]}),`
`,e.jsxs(s.p,{children:["There are four different subtypes of standard ",e.jsx(s.strong,{children:"Messages"}),", in order of priority:"]}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Information"}),": Provides info to users in context. Shouldn't be overused to replace regular content."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Success"}),": Reserved to provide to a success message. They are displayed as a snackbar."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Warning"}),": Reserved for ",e.jsx(s.strong,{children:"Messages"})," that need the user attention and acknowledgment but might not cause errors."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Critical"}),": Reserved for errors, malfunctions, as well as critical issues. Inform the user that a problem requires immediate intervention or correction before the process continues."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Danger"}),": Reserved for alerts to an urgent and potentially hazardous situation that necessitates immediate action to prevent harm or serious consequences."]}),`
`]}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(v,{donts:["- Don't use Message to highlight static or decorative content, prefer components like Card for that","- Don't write overly long or complex Message that could overwhelm or confuse users","- Don't rely solely on color to convey meaning, always keep the Icon for clarity","- Don't use vague or generic text, always provide helpful context or guidance","- Don't overload the interface with multiple simultaneous Messages unless absolutely necessary"],dos:["- Write Message in a clear, concise, and affirmative tone that aligns with the user's task","- Place Message in a visible and relevant area of the page, ideally close to the triggering element if any or top of the section","- Use the correct variant (e.g., information, success, warning, error) to match the context and urgency","- Use non-dismissible Message for critical warnings or errors that require immediate resolution","- Allow content selection (e.g., to copy error messages)"]}),`
`,e.jsx(n,{label:"Best Practices in Context",level:3}),`
`,e.jsx(s.p,{children:e.jsx(s.img,{src:"./base-assets/components/message/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Message"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Icon"})}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Close button"})," - optional"]}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Content"})}),`
`]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(s.p,{children:[e.jsx(s.strong,{children:"Messages"})," show up during a task to notify users of the status of an action. In every page, it is possible to display one or more ",e.jsx(s.strong,{children:"Messages"})," to inform the user."]}),`
`,e.jsx(s.p,{children:"They are positioned near their related items or right after the header and before the page title and page content."}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsx(s.p,{children:"Based on its informational manner, the component default behavior is being read-only. You can only select its content if needed."}),`
`,e.jsxs(s.p,{children:["When a ",e.jsx(s.strong,{children:"Message"})," is dismissible, a click on the ",e.jsx(s.code,{children:"xmark"})," icon button will dismiss the ",e.jsx(s.strong,{children:"Message"}),"."]}),`
`,e.jsx(n,{label:"Variation",level:2}),`
`,e.jsx(n,{label:"Color",level:3}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Information"})," ",e.jsx(s.em,{children:"(default)"}),": informing users of specific content, providing global feedback to the user."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Success"}),": confirming that an action has been completed successfully, providing positive feedback to the user."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Warning"}),": alerting users to potential issues or cautionary information, prompting them to take preventive actions."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Danger"}),": indicating serious issues or errors that require immediate attention, signaling a high level of urgency."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Critical"}),": highlighting severe and potentially catastrophic issues that demand urgent and decisive action to prevent significant negative consequences."]}),`
`]}),`
`,e.jsx(n,{label:"Variant",level:3}),`
`,e.jsxs(s.ul,{children:[`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Default"}),": conveying mild to important information, ensuring the message is seen by the user."]}),`
`,e.jsxs(s.li,{children:[e.jsx(s.strong,{children:"Light"}),": conveying non-urgent, informational content in a subtle and less prominent manner, ensuring the message is seen without drawing too much attention."]}),`
`]}),`
`,e.jsx(n,{label:"Navigation",level:2}),`
`,e.jsx(n,{label:"Focus Management",level:3}),`
`,e.jsxs(s.p,{children:["The ",e.jsx(s.strong,{children:"Message"})," component itself is non-interactive and does not receive keyboard focus."]}),`
`,e.jsxs(s.p,{children:["If the ",e.jsx(s.strong,{children:"Message"})," is dismissible, the close icon button is focusable."]}),`
`,e.jsx(n,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Tab"})," moves focus to the close icon button (if available)."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Enter"}),"or ",e.jsx(s.code,{children:"Space"})," while the close icon button is focused should trigger the action to dismiss the ",e.jsx(s.strong,{children:"Message"}),"."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Shift"})," + ",e.jsx(s.code,{children:"Tab"})," moves focus to the previous interactive element."]}),`
`,e.jsx(n,{label:"Accessibility",level:2}),`
`,e.jsx(n,{label:"Structuring multiple Messages",level:3}),`
`,e.jsxs(s.p,{children:["When displaying multiple ",e.jsx(s.strong,{children:"Messages"})," together, they should be wrapped within an unordered list of items (",e.jsx(s.code,{children:"<ul>"})," and ",e.jsx(s.code,{children:"<li>"}),") to ensure a proper announcement by screen readers."]}),`
`,e.jsx(i,{of:u,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(r,{name:o.circleCheck,style:{color:"var(--ods-color-success-500)"}})," This structure ensures that assistive technologies announce ",e.jsx(s.strong,{children:"Messages"})," as a list, rather than reading them as separate, unrelated announcements."]}),`
`,e.jsxs(s.p,{children:["Screen readers will announce the list, the number of items and the ",e.jsx(s.strong,{children:"Messages"})," content."]}),`
`,e.jsx(n,{label:"Alternative approach with ARIA roles",level:3}),`
`,e.jsxs(s.p,{children:["When modifying the HTML structure is not possible, use ",e.jsx(l,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/list_role",children:'role="list"'})," and ",e.jsx(l,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/listitem_role",children:'role="listitem"'})," to mimic list semantics."]}),`
`,e.jsx(i,{of:p,sourceState:"shown"}),`
`,e.jsx(n,{label:"Setting the container ARIA role",level:3}),`
`,e.jsxs(s.p,{children:["When adding a new ",e.jsx(s.strong,{children:"Message"})," element, its container should have a ",e.jsx(s.code,{children:"role"}),` attribute set, so that assistive
technologies can announce the content correctly.`]}),`
`,e.jsxs(s.p,{children:["If you're adding a critical ",e.jsx(s.strong,{children:"Message"}),", use ",e.jsx(s.code,{children:'role="alert"'}),`.
For non-critical `,e.jsx(s.strong,{children:"Messages"})," (e.g., info, success, warning), use ",e.jsx(s.code,{children:'role="status"'}),"."]}),`
`,e.jsx(i,{of:x,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(r,{name:o.circleCheck,style:{color:"var(--ods-color-success-500)"}})," This ensures that screen readers announce the ",e.jsx(s.strong,{children:"Message"})," at the appropriate time without interrupting."]})]})}function ee(t={}){const{wrapper:s}={...d(),...t.components};return s?e.jsx(s,{...t,children:e.jsx(c,{...t})}):c(t)}export{ee as default};
