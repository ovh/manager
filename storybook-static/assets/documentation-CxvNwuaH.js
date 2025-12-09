import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-DqmHFHkp.js";import{t as r}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l}from"./ods-react60-0db41gCx.js";import{M as c,C as d}from"./index-B5IwYQPI.js";import{S as s,D as h,A as m}from"./skeleton.stories-DhLRDUs1.js";import{B as p,H as t,E as u}from"./Heading-DIbNYTuP.js";import{I as x,B as g}from"./IdentityCard-IiPEMx8A.js";import{R as j,S as f,C as v}from"./Canvas-B71cKOI0.js";import{S as k}from"./StorybookLink-d8YtMUyG.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-CMtJSjaz.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-DGi5N_BW.js";function i(o){const n={em:"em",li:"li",p:"p",strong:"strong",ul:"ul",...a(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(c,{of:s,name:"Documentation"}),`
`,e.jsx(p,{of:s}),`
`,e.jsx(n.p,{children:e.jsxs(n.em,{children:[e.jsx(n.strong,{children:"Skeleton"})," component indicates that data is loading. It improves the perceived loading time for the user."]})}),`
`,e.jsx(d,{of:h,sourceState:"none"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsx(x,{aliases:["Skeleton loader"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=52-10250",githubUrl:"@ovhcloud/ods-react",name:"Skeleton",children:e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Skeleton"})," indicates, through and animation, that content is loading and that the screen is not frozen."]})}),`
`,e.jsx(t,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Skeleton"})," can be used in a variety of contexts such as in Cards, lists, and table content."]}),`
`,e.jsx(t,{label:"Spinner vs Skeleton",level:3}),`
`,e.jsxs(n.p,{children:["Both ",e.jsx(k,{kind:j.spinner,story:f.documentation,children:"Spinner"})," and ",e.jsx(n.strong,{children:"Skeleton"})," indicate that content is loading, but they serve different purposes:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[`
`,e.jsx(n.p,{children:"Use a Spinner when the content or result is unknown and the user must wait. For example, after clicking a button or loading data from an API"}),`
`]}),`
`,e.jsxs(n.li,{children:[`
`,e.jsxs(n.p,{children:["Use a ",e.jsx(n.strong,{children:"Skeleton"})," when the structure of the content is known, but the actual data hasn't loaded yet. It helps set expectations and makes the wait feel shorter"]}),`
`]}),`
`]}),`
`,e.jsx(t,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(g,{donts:["- Don't use Skeleton for static content that doesn't change, load it normally without placeholders","- Don't apply Skeleton to interactive elements like buttons or inputs. Use Spinner or loading states instead","- Don't show Skeleton for very short loading delays, it may feel like a glitch or visual noise","- Don't animate excessively or use distracting visuals. Skeleton should feel smooth and unobtrusive"],dos:["- Use a Skeleton to indicate loading states for dynamic content, such as user data or content blocks","- Prefer Skeleton when content will take more than a moment to load (usually > 500ms)","- Ensure Skeleton is replaced with real content as soon as it is available"]}),`
`,e.jsx(t,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["A ",e.jsx(n.strong,{children:"Skeleton"})," can be placed whenever needed to indicate a content is loading."]}),`
`,e.jsx(t,{label:"Behavior",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Skeleton"})," component has a linear animation to show to indicates a content is loading."]}),`
`,e.jsx(t,{label:"Navigation",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Skeleton"})," component is non-interactive and does not receive keyboard focus. It is purely visual and serves as a placeholder for content loading, without affecting keyboard navigation."]}),`
`,e.jsx(t,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Skeleton"}),` component is purely decorative.
Its role is to visually indicate that content is loading, but it does not carry any meaningful information for assistive technologies.
For this reason, it is hidden from screen readers.`]}),`
`,e.jsx(t,{label:"Indicating loading state",level:3}),`
`,e.jsxs(n.p,{children:["To ensure screen reader users are aware that content is being loaded, you should set ",e.jsx(u,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-busy",children:"aria-busy"})," on the container that will eventually receive the content."]}),`
`,e.jsx(v,{of:m,sourceState:"shown"}),`
`,e.jsxs(n.p,{children:[e.jsx(r,{name:l.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Using this approach ensures that assistive technologies are aware that content is being updated, allowing them to wait before announcing changes."]})]})}function V(o={}){const{wrapper:n}={...a(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(i,{...o})}):i(o)}export{V as default};
