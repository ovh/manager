import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as h}from"./index-a7edfgls.js";import{t as o}from"./Icon-DrfG5m-t-DQEf1CkA.js";import{l as i}from"./ods-react60-0db41gCx.js";import{M as d,C as m}from"./index-DoWmUoCG.js";import{S as r,O as p,A as x,a as u}from"./switch.stories-DApPHkYY.js";import{B as j,H as t,E as l}from"./Heading-CZrRx9wk.js";import{I as g,B as b}from"./IdentityCard-VSBJJaBr.js";import{C as c}from"./Canvas-C43wrg_D.js";import"./index-Bnop-kX6.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./iframe-BRebac83.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./SwitchItem-bGtISEN6-D2kiHTKw.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./ods-react236-aAAP9SXj.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-B2BoNaf5.js";function a(n){const s={code:"code",em:"em",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",...h(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{of:r,name:"Documentation"}),`
`,e.jsx(j,{of:r}),`
`,e.jsx(s.p,{children:e.jsxs(s.em,{children:["A ",e.jsx(s.strong,{children:"Switch"})," allows users to quickly and easily switch between several states, actions or options in a row."]})}),`
`,e.jsx(m,{of:p,sourceState:"none"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsx(g,{aliases:["Button group","Segmented control","Toggle group"],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/ODS---UI-Kit?node-id=52-10578",githubUrl:"@ovhcloud/ods-react",name:"Switch",children:e.jsxs(s.p,{children:["A ",e.jsx(s.strong,{children:"Switch"})," allows users to quickly and easily switch between several states, actions or options in a row."]})}),`
`,e.jsx(t,{label:"Usage",level:2}),`
`,e.jsxs(s.p,{children:["A ",e.jsx(s.strong,{children:"Switch"})," is used to switch between multiple states, actions or options (up-to 4)."]}),`
`,e.jsx(s.p,{children:"It can be used for many use cases such as selecting a state within a group of states or filtering."}),`
`,e.jsx(t,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(b,{donts:["- Don't use a Switch for more than 4 options. Prefer Radio Group, Checkbox, or Select instead depending on your use case","- Don't use a Switch for unrelated options, they should belong to a common category or context","- Don't use a Switch if selecting an option does not produce an immediate effect. Use a Checkbox or another control instead","- Don't rely solely on icons, add text for clarity"],dos:["- Use a Switch when the user must choose one active option among 2 to 4 closely related states or actions","- Ensure each Switch item has a clear, descriptive label","- Use a Switch when immediate feedback or real-time filtering is expected upon selection"]}),`
`,e.jsx(t,{label:"Best Practices in Context",level:3}),`
`,e.jsx(s.p,{children:e.jsx(s.img,{src:"./base-assets/components/switch/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(s.ol,{children:[`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Switch"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Active toggle button"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Toggle button"})}),`
`,e.jsx(s.li,{children:e.jsx(s.strong,{children:"Label"})}),`
`]}),`
`,e.jsx(t,{label:"Placement",level:2}),`
`,e.jsxs(s.p,{children:["A ",e.jsx(s.strong,{children:"Switch"}),` can be used in a page when the user needs to select a choice from multiple states or items.
It may replace two radio buttons or a single checkbox to allow users to choose between several states.`]}),`
`,e.jsxs(s.p,{children:["By default, the width of a ",e.jsx(s.strong,{children:"Switch"}),` item is defined by the length of content.
A custom width can be set so all items on the track will have the same size regardless of content length.`]}),`
`,e.jsx(t,{label:"Behavior",level:2}),`
`,e.jsxs(s.p,{children:["The user can switch between states by clicking the ",e.jsx(s.strong,{children:"Switch"})," items, and it has an immediate effect."]}),`
`,e.jsx(t,{label:"Navigation",level:2}),`
`,e.jsx(t,{label:"Focus Management",level:3}),`
`,e.jsxs(s.p,{children:["When the ",e.jsx(s.strong,{children:"Switch"})," receives focus, it is set on the currently selected item, or on the first item if none is selected."]}),`
`,e.jsxs(s.p,{children:["Each individual ",e.jsx(s.strong,{children:"Switch"})," item is focusable unless disabled. A disabled item cannot receive focus or be activated."]}),`
`,e.jsx(s.p,{children:"Focus remains within the group when navigating between items using arrow keys."}),`
`,e.jsx(t,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Tab"})," moves focus to the selected item or the first item in the group."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Shift"})," + ",e.jsx(s.code,{children:"Tab"})," moves focus to the previous focusable element outside the ",e.jsx(s.strong,{children:"Switch"})," group."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Arrow Right"})," or ",e.jsx(s.code,{children:"Arrow Down"})," moves focus to the next item in the group."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Arrow Left"})," or ",e.jsx(s.code,{children:"Arrow Up"})," moves focus to the previous item in the group."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Home"})," (or ",e.jsx(s.code,{children:"fn"})," + ",e.jsx(s.code,{children:"Arrow Left"}),") moves focus to the first item."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"End"})," (or ",e.jsx(s.code,{children:"fn"})," + ",e.jsx(s.code,{children:"Arrow Right"}),") moves focus to the last item."]}),`
`,e.jsxs(s.p,{children:["Pressing ",e.jsx(s.code,{children:"Space"})," or ",e.jsx(s.code,{children:"Enter"})," activates or deactivates the focused item, updating the selection immediately."]}),`
`,e.jsx(t,{label:"Accessibility",level:2}),`
`,e.jsxs(s.p,{children:["To ensure proper accessibility, ",e.jsx(s.strong,{children:"Switch"})," must be correctly labeled."]}),`
`,e.jsx(t,{label:"Always provide an explicit label",level:3}),`
`,e.jsxs(s.p,{children:["Every ",e.jsx(s.strong,{children:"Switch"}),` must have a clear and explicit label to ensure that users (especially screen reader users) understand its purpose,
using either an `,e.jsx(l,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-label",children:"aria-label"}),`
or an `,e.jsx(l,{href:"https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-labelledby",children:"aria-labelledby"})," attribute."]}),`
`,e.jsx(c,{of:x,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(o,{name:i.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label and the option information (text, position, selection state)."]}),`
`,e.jsx(c,{of:u,sourceState:"shown"}),`
`,e.jsxs(s.p,{children:[e.jsx(o,{name:i.circleCheck,style:{color:"var(--ods-color-success-500)"}})," Screen readers will announce the label and the option information (text, position, selection state)."]})]})}function V(n={}){const{wrapper:s}={...h(),...n.components};return s?e.jsx(s,{...n,children:e.jsx(a,{...n})}):a(n)}export{V as default};
