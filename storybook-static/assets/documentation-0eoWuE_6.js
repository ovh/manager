import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-BjQHK-Oi.js";import{M as a,C as c}from"./index-DThejhUn.js";import{B as l,H as o,E as d}from"./Heading-B0W0XnI0.js";import{I as h,B as p}from"./IdentityCard-DW_r5_-c.js";import"./StorybookLink-C-gxHBNR.js";import{A as t,O as m}from"./accordion.stories-DUe4gk78.js";import"./index-Bnop-kX6.js";import"./iframe-6yjxaTqs.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";import"./index-Dn0Jgxxy.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./AccordionTrigger-CaSa0zEH-CeN99oZg.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./collapsible-content-zo5LZi6B-BM-FWdPL.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";function i(s){const n={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:t,name:"Documentation"}),`
`,e.jsx(l,{of:t}),`
`,e.jsx(n.p,{children:e.jsxs(n.em,{children:["An ",e.jsx(n.strong,{children:"Accordion"})," is a vertical header that reveals or hides an associated section of content."]})}),`
`,e.jsx(c,{of:m,sourceState:"none"}),`
`,e.jsx(o,{label:"Overview",level:2}),`
`,e.jsxs(h,{aliases:["Collapsible","FAQ"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=1-6634",githubUrl:"@ovhcloud/ods-react",name:"Accordion",children:[e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Accordion"})," component delivers large amounts of content in a small space through progressive disclosure."]}),e.jsx(n.p,{children:`The header part gives the user a high-level overview of the content allowing them to decide which sections to
read.`}),e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Accordions"}),` can make information processing and discovering more effective. However, it does hide content
from the users, and it's important to account for a user not noticing or reading all the included content. If a user
is likely to read all the content then then the usage of an `,e.jsx(n.strong,{children:"Accordion"}),` would not be recommended as it adds an extra
interaction to access the content; instead use a full scrolling page with normal headers.`]})]}),`
`,e.jsx(o,{label:"Usage",level:2}),`
`,e.jsx(n.p,{children:`Use any number of elements to visually display them as a group.
Several collapsible panels can co-exist in a same interface.`}),`
`,e.jsx(n.p,{children:"Use this component for :"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Organizing related information"}),`
`,e.jsx(n.li,{children:"Shortening pages and reducing scrolling when content is not crucial to read in full"}),`
`,e.jsx(n.li,{children:"When space is at a premium and long content cannot be displayed all at once, like on a mobile interface or in a side panel"}),`
`]}),`
`,e.jsx(o,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(p,{donts:["- Don't nest Accordions inside each other","- Don't use Accordion to hide critical information needed for completing a task",`- Don't use vague or generic titles like "Section 1", they should be descriptive`,"- Don't expose a lot of content in the title"],dos:["- Use Accordion to progressively disclose content, especially in long or dense pages","- Ensure the summary/title of each Accordion clearly communicates what it contains","- Use Accordions to group related content (e.g., FAQ)","- Keep the content within each panel concise and scannable","- Use Accordion instead of Tab if users need to see multiple sections at once"]}),`
`,e.jsx(o,{label:"Best Practices in Context",level:3}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"./base-assets/components/accordion/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Accordion"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Header"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Panel"})}),`
`]}),`
`,e.jsx(o,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Accordion"})," component is adjusted to the parent's width. It can vary based on the content, layout, and page design."]}),`
`,e.jsxs(n.p,{children:["By default, the ",e.jsx(n.strong,{children:"Accordion"})," content is left-aligned in its container, as the header does."]}),`
`,e.jsx(n.p,{children:"It can be placed within main page content or inside a side container (as panels, or tiles)."}),`
`,e.jsx(o,{label:"Behavior",level:2}),`
`,e.jsxs(n.p,{children:["An ",e.jsx(n.strong,{children:"Accordion"})," can be hovered, focused, clicked and disabled."]}),`
`,e.jsxs(n.p,{children:[e.jsx(n.strong,{children:"Accordion"})," has two states : collapsed and expanded. It is collapsed by default."]}),`
`,e.jsx(n.p,{children:`When triggering the header part, the panel part should react as expanding or collapsing, depending on what previous
state it had.`}),`
`,e.jsx(n.p,{children:"The mouse cursor acts as a clickable area on the Header part of the component."}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Icon"})," helps the user to know if the ",e.jsx(n.strong,{children:"Accordion"})," is collapsed or expanded :"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Collapsed : chevron points down"}),`
`,e.jsx(n.li,{children:"Expanded : chevron points up"}),`
`]}),`
`,e.jsx(n.p,{children:"The Header part of this component acts like a button, with hover, focus and active styles."}),`
`,e.jsx(n.p,{children:"Same behavior and styling applies to both Desktop and Mobile modes."}),`
`,e.jsx(o,{label:"Navigation",level:2}),`
`,e.jsx(o,{label:"Focus Management",level:3}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Accordion"})," header can receive keyboard focus and is part of the standard tab order."]}),`
`,e.jsx(n.p,{children:"Focus remains on the header after toggling the section."}),`
`,e.jsxs(n.p,{children:["If the ",e.jsx(n.strong,{children:"Accordion"})," is disabled, it does not receive focus and cannot be activated via keyboard."]}),`
`,e.jsx(o,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Enter"})," or ",e.jsx(n.code,{children:"Space"})," on a focused ",e.jsx(n.strong,{children:"Accordion"})," header toggles its expansion or collapse."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Escape"})," does not close an expanded ",e.jsx(n.strong,{children:"Accordion"})," section (unless additional custom behavior is implemented)."]}),`
`,e.jsx(o,{label:"Navigation between sections",level:3}),`
`,e.jsxs(n.p,{children:["If multiple ",e.jsx(n.strong,{children:"Accordions"})," exist, users can navigate between headers using the ",e.jsx(n.code,{children:"Tab"})," key."]}),`
`,e.jsxs(n.p,{children:["There is no looping between headers: pressing ",e.jsx(n.code,{children:"Tab"})," on the last header moves focus to the next interactive element outside the Accordion."]}),`
`,e.jsxs(n.p,{children:["Arrow keys (",e.jsx(n.code,{children:"Arrow Up"})," / ",e.jsx(n.code,{children:"Arrow Down"}),") do not move between ",e.jsx(n.strong,{children:"Accordions"})," by default."]}),`
`,e.jsx(o,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["This component complies with the ",e.jsx(d,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/accordion",children:"Accordion WAI-ARIA design pattern"}),"."]})]})}function L(s={}){const{wrapper:n}={...r(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(i,{...s})}):i(s)}export{L as default};
