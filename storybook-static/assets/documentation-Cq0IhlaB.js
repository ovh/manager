import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-9z69ejKn.js";import{M as l,C as d}from"./index-CPj7UjxC.js";import{S as c,a as n,b as a,c as h}from"./index-Nie__xJS.js";import m,{SimpleTile as p}from"./tile.stories-CD0yzJQB.js";import{e as s}from"./external-links-D-zcWSEn.js";import"./index-Bnop-kX6.js";import"./iframe-BcIzvxf8.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./lib-sJyaz0Xv-Dlg__FL0.js";import"./QueryClientProvider-C1FTVqK-.js";import"./index-ChsYPcXR.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react94-Bxf0SjVg.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./ods-react60-0db41gCx.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-BLrISLal.js";import"./ods-react63-CRCMVrAF.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-4e7GV2_-.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./ods-react65-wKxTpDjY.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";function o(t){const i={a:"a",code:"code",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Manager UI Kit/Components/tile/Documentation"}),`
`,e.jsx(c,{of:m}),`
`,e.jsxs(i.p,{children:[e.jsx(i.code,{children:"Tile"})," component is used to display generic standalone section of a document."]}),`
`,e.jsx(d,{of:p,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsxs(a,{aliases:["Dashboard Tile","Manager Tile"],githubUrl:s.github.tile,name:"Tile",relatedComponents:[{name:"Card",href:s.ods.card},{name:"Text",href:s.ods.text},{name:"Divider",href:s.ods.divider},{name:"Section",href:s.nativeElements.section},{name:"Description List",href:s.nativeElements.descriptionList}],children:[e.jsx(i.p,{children:"It facilitates:"}),e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:["List of groups of terms and descriptions enclosed in a ",e.jsx(i.a,{href:"https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dl",rel:"nofollow",children:"Description List"}),". ",e.jsx(i.strong,{children:"Generally on Product Dashboard."})]}),`
`,e.jsx(i.li,{children:"Display group of actions"}),`
`]})]}),`
`,e.jsx(n,{label:"Anatomy",level:2}),`
`,e.jsxs(i.ol,{children:[`
`,e.jsxs(i.li,{children:[e.jsx(i.strong,{children:"Card"}),": ODS Card; flexible container to display information in a structured manner"]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.strong,{children:"Section"}),": Represents a section of the page with heading to identify the data in the card."]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.strong,{children:"Text"})," (h4): ODS Text; Text with preset ",e.jsx(i.code,{children:"heading-4"})," to identify the section with heading."]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.strong,{children:"Description List"}),": ",e.jsx(i.code,{children:"dl"}),"; To encloses a list of groups of terms and descriptions.",`
`,e.jsxs(i.ol,{children:[`
`,e.jsxs(i.li,{children:[e.jsx(i.strong,{children:"Description Term"}),": ",e.jsx(i.code,{children:"dt"}),"; Specifies a term in the description list. Usually followed by ",e.jsx(i.code,{children:"dd"})," element."]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.strong,{children:"Description Details"}),": ",e.jsx(i.code,{children:"dd"}),"; provides the description, definition, or value for the preceding term."]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.strong,{children:"Divider"}),": ODS Divider; indicates the end of a combination of ",e.jsx(i.code,{children:"dt"})," and ",e.jsx(i.code,{children:"dd"})," elements."]}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsx(h,{dos:["Do use Tile component to display information in Tile on Dashboard layout or where it makes sense to display description list","Do use Tile.Item.Term and Tile.Item.Description in combination while respecting the rules of description list","Do use Links as descendants of Tile.Item.Description"],donts:["Do not use any other components or native HTML elements as the children of Tile component. Only `Tile.Item` is permitted","Do not use Tile.Item.Term or Tile.Item.Description alone","Do not use header, footer or heading(h1-h6) in Tile.Item.Term"]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(i.p,{children:["The ",e.jsx(i.strong,{children:"Tile"})," component is typically placed in the Dashboard below the ",e.jsx(i.code,{children:"Tabs"}),"."]}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsx(i.p,{children:e.jsx(i.strong,{children:"Interactions"})}),`
`,e.jsx(i.p,{children:"Actions"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsxs(i.li,{children:["Actions Menu is displayed next to ",e.jsx(i.code,{children:"Tile.Item.Term"})," that has a list of grouped actions related to the term."]}),`
`,e.jsxs(i.li,{children:[e.jsx(i.code,{children:"Tile.Item.Description"})," can be used to display links to guides/actions related to the preceding term in ",e.jsx(i.code,{children:"Tile.Item.Term"}),"."]}),`
`]}),`
`,e.jsx(n,{label:"Variation",level:2}),`
`,e.jsx(i.p,{children:e.jsx(i.strong,{children:"Description List"})}),`
`,e.jsx(i.p,{children:"Tile can be used in Description List form to display group of related information the key-value pair. Description List itself can have multiple variations."}),`
`,e.jsxs(i.ol,{children:[`
`,e.jsx(i.li,{children:"Single Term and Description"}),`
`,e.jsx(i.li,{children:"Muliple Terms and Single Description"}),`
`,e.jsx(i.li,{children:"Single Term and Multiple Descriptions"}),`
`,e.jsx(i.li,{children:"Multiple terms and Multiple Descriptions"}),`
`]}),`
`,e.jsx(n,{label:"Accessibility",level:2}),`
`,e.jsxs(i.p,{children:[e.jsx(i.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(i.strong,{children:e.jsx(i.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(i.p,{children:"To meet accessibility standards:"}),`
`,e.jsxs(i.ul,{children:[`
`,e.jsx(i.li,{children:"Ensure heading is set for the Section element."}),`
`,e.jsxs(i.li,{children:["Every ",e.jsx(i.code,{children:"dt"})," element is a child of ",e.jsx(i.code,{children:"dl"})," or ",e.jsx(i.code,{children:"div"})," that is a child of ",e.jsx(i.code,{children:"dl"})," element."]}),`
`,e.jsxs(i.li,{children:["Every ",e.jsx(i.code,{children:"dd"})," element is a child of ",e.jsx(i.code,{children:"dl"})," or ",e.jsx(i.code,{children:"div"})," that is a child of ",e.jsx(i.code,{children:"dl"})," element. This element can be used after a ",e.jsx(i.code,{children:"dt"})," or another ",e.jsx(i.code,{children:"dd"})," element."]}),`
`]})]})}function _(t={}){const{wrapper:i}={...r(),...t.components};return i?e.jsx(i,{...t,children:e.jsx(o,{...t})}):o(t)}export{_ as default};
