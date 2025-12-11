import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as d}from"./index-Q1c3vqG7.js";import{t as o}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as r}from"./ods-react60-0db41gCx.js";import{E as h,$ as p,S as u}from"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import{M as m,C as x}from"./index-DAHS-wil.js";import{S as l,O as g,A as j,a as b,b as f}from"./spinner.stories-uG8-jPrJ.js";import{B as v,H as i,E as s}from"./Heading-C4IxIajs.js";import{I as y,B as S}from"./IdentityCard-RZ6xy6Df.js";import{R as w,S as k,C as a}from"./Canvas-BUqQNO43.js";import{S as A}from"./StorybookLink-CM8iApez.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./iframe-Dhu224za.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-C1gQJPyk.js";function c(t){const n={code:"code",em:"em",li:"li",p:"p",strong:"strong",ul:"ul",...d(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(m,{of:l,name:"Documentation"}),`
`,e.jsx(v,{of:l}),`
`,e.jsx(n.p,{children:e.jsx(n.em,{children:"A visual indicator that a process is happening in the background but the interface is not yet ready for interaction."})}),`
`,e.jsx(x,{of:g,sourceState:"none"}),`
`,e.jsx(i,{label:"Overview",level:2}),`
`,e.jsx(y,{aliases:["Loading","Spin","Circular Progress"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=52-10340",githubUrl:"@ovhcloud/ods-react",name:"Spinner",children:e.jsx(n.p,{children:`A visual indicator that a process is happening in the background but the interface is not yet ready for
interaction.`})}),`
`,e.jsx(i,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Spinner"})," component is used as a fallback when complex content is loading in the background."]}),`
`,e.jsx(i,{label:"Spinner vs Skeleton",level:3}),`
`,e.jsxs(n.p,{children:["Both ",e.jsx(n.strong,{children:"Spinner"})," and ",e.jsx(A,{kind:w.skeleton,story:k.documentation,children:"Skeleton"})," indicate that content is loading, but they serve different purposes:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:["Use a ",e.jsx(n.strong,{children:"Spinner"})," when the content or result is unknown and the user must wait. For example, after clicking a button or loading data from an API"]}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:"Use a Skeleton when the structure of the content is known, but the actual data hasn't loaded yet. It helps set expectations and makes the wait feel shorter"}),`
`]}),`
`]}),`
`,e.jsx(i,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(S,{donts:["- Don't use multiple Spinners on the same page, it creates confusion and visual noise. Use a single centralized Spinner or loading overlay","- Don't use a Spinner for text or layout placeholders, use the Skeleton component instead, which better preserves structure","- Don't use a Spinner if the loading duration is extremely short, this can feel like a flicker or visual glitch","- Don't place Spinners in interactive elements like buttons without also disabling them and explaining the ongoing action"],dos:["- Use a Spinner to indicate indeterminate loading when the duration is unknown or cannot be measured","- Use a Spinner when complex or background processes are happening (e.g. fetching filtered data, saving a form)","- Display a Spinner if the loading is expected to take more than a couple of seconds, to reassure the user",`- Combine the Spinner with contextual messaging (e.g. "Loading [...]" or "Saving your changes") to clarify what's happening`]}),`
`,e.jsx(i,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Spinner"})," can be placed where needed, whether it's centered on an overlay or specific container/content in the page."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Spinner"})," can widen to match its container."]}),`
`,e.jsx(i,{label:"Behavior",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Spinner"})," component has a spinning animation to show to the user that the background process is moving on."]}),`
`,e.jsx(i,{label:"Variation",level:2}),`
`,e.jsx(i,{label:"Color",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Primary"})," (default): used in contexts where the ",e.jsx(n.strong,{children:"Spinner"})," is tied to the main brand action"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Neutral"}),": used for secondary or subtle loading indicators, and commonly displayed in disabled parent components to indicate background activity without drawing too much attention"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"White"}),": designed for use on dark or colored backgrounds to ensure proper contrast and visibility"]}),`
`]}),`
`,e.jsx(i,{label:"Navigation",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Spinner"})," component is non-interactive and does not receive keyboard focus. It is purely visual and serves as a loading indicator, without affecting keyboard navigation."]}),`
`,e.jsx(i,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Spinner"})," component does not automatically provide enough context for assistive technologies. To ensure accessibility, additional attributes must be applied to the container that holds the loading content."]}),`
`,e.jsx(i,{label:"Indicating loading state",level:3}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Spinner"})," itself does not convey the loading state. This responsibility falls on the container where content is being loaded by using  ",e.jsx(s,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy",children:"aria-busy"})," and ",e.jsx(s,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live",children:"aria-live"}),"."]}),`
`,e.jsx(a,{of:j,sourceState:"shown"}),`
`,e.jsx(n.p,{children:"Explanations:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:'aria-busy="true"'})," informs assistive technologies that content is being updated."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:'aria-live="polite"'})," ensures that the loading message is announced when necessary without interrupting."]}),`
`]}),`
`,e.jsxs(n.p,{children:[e.jsx(o,{name:r.circleCheck,style:{color:"var(--ods-color-success-500)"}})," This approach ensures that users with assistive technologies understand when loading starts and ends."]}),`
`,e.jsxs(h,{color:"information",dismissible:!1,style:{width:"100%"},children:[e.jsx(p,{name:"circle-info"}),e.jsx(u,{children:e.jsx(n.p,{children:"Once the content is loaded, aria-busy should be set to false."})})]}),`
`,e.jsx(i,{label:"Linking the Spinner to a loading description",level:3}),`
`,e.jsxs(n.p,{children:["If the ",e.jsx(n.strong,{children:"Spinner"})," is associated with a specific loading action, it should be explicitly labeled using ",e.jsx(s,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",children:"aria-labelledby"})," or ",e.jsx(s,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",children:"aria-label"}),"."]}),`
`,e.jsx(a,{of:b,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(o,{name:r.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the spinner and its current state."]}),`
`,e.jsx(a,{of:f,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(o,{name:r.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label, the spinner and its current state."]})]})}function ae(t={}){const{wrapper:n}={...d(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(c,{...t})}):c(t)}export{ae as default};
