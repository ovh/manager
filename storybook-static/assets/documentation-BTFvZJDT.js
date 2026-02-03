import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-CUIskjj6.js";import{M as l,C as d}from"./index-BRK_XPYQ.js";import{S as c,a as i,b as a,c as h}from"./index-B_aKxHdK.js";import m,{SimpleTile as p}from"./tile.stories-BGYI5k2t.js";import{e as t}from"./external-links-D-zcWSEn.js";import"./index-Bnop-kX6.js";import"./iframe-Bmn67lXx.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./lib-D44cvI9Y-BwqRLB_Z.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-B5_veLQO.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./ComboboxControl-sJOkWHeT-DJbuE-Pm.js";import"./ods-react236-aAAP9SXj.js";import"./MessageIcon-yhpEHWAg-CXHPnT2G.js";import"./Divider-THit99OS-BLm7oKDW.js";function o(s){const n={a:"a",code:"code",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...s.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Manager UI Kit/Components/tile/Documentation"}),`
`,e.jsx(c,{of:m}),`
`,e.jsxs(n.p,{children:[e.jsx(n.code,{children:"Tile"})," component is used to display generic standalone section of a document."]}),`
`,e.jsx(d,{of:p,sourceState:"none"}),`
`,e.jsx(i,{label:"Overview",level:2}),`
`,e.jsxs(a,{aliases:["Dashboard Tile","Manager Tile"],githubUrl:t.github.tile,name:"Tile",relatedComponents:[{name:"Card",href:t.ods.card},{name:"Text",href:t.ods.text},{name:"Divider",href:t.ods.divider},{name:"Section",href:t.nativeElements.section},{name:"Description List",href:t.nativeElements.descriptionList}],children:[e.jsx(n.p,{children:"It facilitates:"}),e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["List of groups of terms and descriptions enclosed in a ",e.jsx(n.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl",rel:"nofollow",children:"Description List"}),". ",e.jsx(n.strong,{children:"Generally on Product Dashboard."})]}),`
`,e.jsx(n.li,{children:"Display group of actions"}),`
`]})]}),`
`,e.jsx(i,{label:"Anatomy",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Card"}),": ODS Card; flexible container to display information in a structured manner"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Section"}),": Represents a section of the page with heading to identify the data in the card."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Text"})," (h4): ODS Text; Text with preset ",e.jsx(n.code,{children:"heading-4"})," to identify the section with heading."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Description List"}),": ",e.jsx(n.code,{children:"dl"}),"; To encloses a list of groups of terms and descriptions.",`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Description Term"}),": ",e.jsx(n.code,{children:"dt"}),"; Specifies a term in the description list. Usually followed by ",e.jsx(n.code,{children:"dd"})," element."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Description Details"}),": ",e.jsx(n.code,{children:"dd"}),"; provides the description, definition, or value for the preceding term."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Divider"}),": ODS Divider; indicates the end of a combination of ",e.jsx(n.code,{children:"dt"})," and ",e.jsx(n.code,{children:"dd"})," elements."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(i,{label:"Usage",level:2}),`
`,e.jsx(h,{dos:["Do use Tile component to display information in Tile on Dashboard layout or where it makes sense to display description list","Do use Tile.Item.Term and Tile.Item.Description in combination while respecting the rules of description list","Do use Links as descendants of Tile.Item.Description"],donts:["Do not use any other components or native HTML elements as the children of Tile component. Only `Tile.Item` is permitted","Do not use Tile.Item.Term or Tile.Item.Description alone","Do not use header, footer or heading(h1-h6) in Tile.Item.Term"]}),`
`,e.jsx(i,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Tile"})," component is typically placed in the Dashboard below the ",e.jsx(n.code,{children:"Tabs"}),"."]}),`
`,e.jsx(i,{label:"Behavior",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Interactions"})}),`
`,e.jsx(n.p,{children:"Actions"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Actions Menu is displayed next to ",e.jsx(n.code,{children:"Tile.Item.Term"})," that has a list of grouped actions related to the term."]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"Tile.Item.Description"})," can be used to display links to guides/actions related to the preceding term in ",e.jsx(n.code,{children:"Tile.Item.Term"}),"."]}),`
`]}),`
`,e.jsx(i,{label:"Variation",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Description List"})}),`
`,e.jsx(n.p,{children:"Tile can be used in Description List form to display group of related information the key-value pair. Description List itself can have multiple variations."}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"Single Term and Description"}),`
`,e.jsx(n.li,{children:"Muliple Terms and Single Description"}),`
`,e.jsx(n.li,{children:"Single Term and Multiple Descriptions"}),`
`,e.jsx(n.li,{children:"Multiple terms and Multiple Descriptions"}),`
`]}),`
`,e.jsx(i,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(n.p,{children:"To meet accessibility standards:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Ensure heading is set for the Section element."}),`
`,e.jsxs(n.li,{children:["Every ",e.jsx(n.code,{children:"dt"})," element is a child of ",e.jsx(n.code,{children:"dl"})," or ",e.jsx(n.code,{children:"div"})," that is a child of ",e.jsx(n.code,{children:"dl"})," element."]}),`
`,e.jsxs(n.li,{children:["Every ",e.jsx(n.code,{children:"dd"})," element is a child of ",e.jsx(n.code,{children:"dl"})," or ",e.jsx(n.code,{children:"div"})," that is a child of ",e.jsx(n.code,{children:"dl"})," element. This element can be used after a ",e.jsx(n.code,{children:"dt"})," or another ",e.jsx(n.code,{children:"dd"})," element."]}),`
`]})]})}function P(s={}){const{wrapper:n}={...r(),...s.components};return n?e.jsx(n,{...s,children:e.jsx(o,{...s})}):o(s)}export{P as default};
