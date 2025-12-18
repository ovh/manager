import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-BjQHK-Oi.js";import{M as o,C as c}from"./index-DThejhUn.js";import{T as r,O as d}from"./tree-view.stories-iHlLCfiy.js";import{B as a,H as s,E as h}from"./Heading-B0W0XnI0.js";import{I as x,B as p}from"./IdentityCard-DW_r5_-c.js";import"./StorybookLink-C-gxHBNR.js";import"./index-Bnop-kX6.js";import"./iframe-6yjxaTqs.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react236-aAAP9SXj.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./TreeViewNodes-BTaZHq6H-Zfg7PUSJ.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./collapsible-content-zo5LZi6B-BM-FWdPL.js";import"./controls-BtiQQn1l.js";import"./ods-docgen-map-C6vdLMLl.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Divider-THit99OS-DE11lmva.js";import"./index-Dn0Jgxxy.js";function t(i){const n={code:"code",img:"img",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...l(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{of:r,name:"Documentation",tags:["new"]}),`
`,e.jsx(a,{of:r}),`
`,e.jsx(c,{of:d,sourceState:"none"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(x,{aliases:[],figmaLink:"https://www.figma.com/design/9jDDTcR4a9jPRFcdjawAlf/branch/8NZfqeptysMQInF02WaIJR",githubUrl:"@ovhcloud/ods-react",name:"Tree View",startingVersion:19,children:e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Tree View"})," component displays hierarchical data in a parent-child structure. It allows users to expand, collapse, and interact with nested items."]})}),`
`,e.jsx(s,{label:"Anatomy",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.img,{src:"./base-assets/components/tree-view/anatomy.png",alt:"Component anatomy",title:"Component anatomy"})}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Tree View"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Node/item"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Checkbox (multi-selection)"})}),`
`,e.jsx(n.li,{children:e.jsx(n.strong,{children:"Node/item name"})}),`
`]}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Tree View"}),` component is used to navigate or manage hierarchical datasets,
for representing file systems, nested categories, any structured dataset that benefits from a collapsible interface.`]}),`
`,e.jsx(n.p,{children:"Common use cases include:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Directory structures"}),`
`,e.jsx(n.li,{children:"Nested navigation menus"}),`
`,e.jsx(n.li,{children:"Category selectors"}),`
`,e.jsx(n.li,{children:"Configurations and settings with nested options?"}),`
`]}),`
`,e.jsx(s,{label:"Dos & Don'ts",level:3}),`
`,e.jsx(p,{donts:["- Don’t use a Tree View if there are no nodes or if the content is too minimal to justify a hierarchical structure"],dos:["- Use a Tree View for hierarchical data where relationships between items are important"]}),`
`,e.jsx(s,{label:"Behavior",level:2}),`
`,e.jsx(s,{label:"Expand / Collapse",level:3}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Items/Nodes can be expanded or collapsed to show or hide their children"}),`
`,e.jsx(n.li,{children:"The Tree View can be rendered with all nodes expanded by default"}),`
`,e.jsx(n.li,{children:"Individual nodes can be configured to start in an expanded state when the Tree View is rendered"}),`
`]}),`
`,e.jsx(s,{label:"Selection",level:3}),`
`,e.jsx(s,{label:"Single Selection",level:4}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Clicking a node selects it and deselects any previously selected node"}),`
`]}),`
`,e.jsx(s,{label:"Checkbox tree/multi-selection",level:4}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Each node/item has a checkbox for selection"}),`
`,e.jsxs(n.li,{children:["Parent checkbox can represent:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Checked: all children are selected"}),`
`,e.jsx(n.li,{children:"Unchecked: no children are selected"}),`
`,e.jsx(n.li,{children:"Indeterminate: partial selection of children"}),`
`]}),`
`]}),`
`,e.jsx(n.li,{children:"Selecting a parent node/item selects or deselects all children recursively"}),`
`]}),`
`,e.jsx(s,{label:"Disabling",level:3}),`
`,e.jsx(n.p,{children:"Disabled nodes cannot be selected, expanded, collapsed, or interact with. They are still display in the hierarchy for context."}),`
`,e.jsx(s,{label:"Navigation",level:2}),`
`,e.jsx(s,{label:"Focus Management",level:3}),`
`,e.jsx(n.p,{children:"Only one node in the Tree View is focusable at a time."}),`
`,e.jsx(n.p,{children:"Focus remains on a single visible node and moves predictably with keyboard navigation."}),`
`,e.jsx(n.p,{children:"If a node contains interactive elements (e.g., a checkbox or link), those elements can receive focus."}),`
`,e.jsx(s,{label:"General Keyboard Shortcuts",level:3}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Up / Down"})," moves focus to the previous or next visible node."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Right"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"If the focused node is collapsed, expands it"}),`
`,e.jsx(n.li,{children:"If the focused node is expanded, moves focus to its first child"}),`
`]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Arrow Left"}),":"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"If the focused node is expanded, collapses it"}),`
`,e.jsx(n.li,{children:"If the focused node is collapsed, moves focus to its parent"}),`
`]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Home"}),", or ",e.jsx(n.code,{children:"fn"})," + ",e.jsx(n.code,{children:"Arrow Left"}),", moves focus to the first visible node."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"End"}),", or ",e.jsx(n.code,{children:"fn"})," + ",e.jsx(n.code,{children:"Arrow Right"})," moves focus to the last visible node."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Enter"})," or ",e.jsx(n.code,{children:"Space"})," activates, expands, or collapses the focused node. If the node has a checkbox, it toggles its state."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Enter"}),"or ",e.jsx(n.code,{children:"Space"})," + ",e.jsx(n.code,{children:"Shift"})," + ",e.jsx(n.code,{children:"Arrow Up / Down"})," selects a continuous range of nodes (multi-selection mode)."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Enter"}),"or ",e.jsx(n.code,{children:"Space"})," + ",e.jsx(n.code,{children:"Ctrl"}),"or ",e.jsx(n.code,{children:"Cmd"})," toggles selection of individual node."]}),`
`,e.jsxs(n.p,{children:["Pressing ",e.jsx(n.code,{children:"Ctrl"})," or ",e.jsx(n.code,{children:"Cmd"})," + ",e.jsx(n.code,{children:"A"})," selects all nodes in the tree. When all nodes are already selected, it unselects all nodes."]}),`
`,e.jsxs(n.p,{children:["Typing an alphanumeric character (",e.jsx(n.code,{children:"A-Z"}),", ",e.jsx(n.code,{children:"a-z"}),") changes focus to the next node starting with that character."]}),`
`,e.jsx(s,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:["This component complies with the ",e.jsx(h,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/treeview/",children:"Tree View WAI-ARIA design pattern"})]})]})}function J(i={}){const{wrapper:n}={...l(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(t,{...i})}):t(i)}export{J as default};
