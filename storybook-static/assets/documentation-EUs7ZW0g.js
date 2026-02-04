import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as o}from"./index-g6nCrg6v.js";import{b as l,S as s,c as r,a as c,d}from"./index-BGUR791c.js";import{M as h,C as g}from"./index-CFQnl7m9.js";import p,{DemoTagsTile as m}from"./tags-tile.stories-Bjj4--b2.js";import{e as i}from"./external-links-D-zcWSEn.js";import"./index-Bnop-kX6.js";import"./Link-TMoA1i18-DiBAU0SL.js";import"./index-CWkFp9WS-BSIT86NH.js";import"./iframe-CaW5sJsF.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./lib-7WI39Bnb-C2vw7fTL.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./Icon-xxQ9IRzi-ORI6lMWl.js";import"./Text-BGoUCJU7-BjFZdlzU.js";import"./ComboboxControl-EYkaEIlI-CWYTos8A.js";import"./Divider-wQyo85oE-5vlIiwia.js";function a(t){const n={a:"a",br:"br",code:"code",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...o(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:"Manager UI Kit/Components/TagsTile/Documentation"}),`
`,e.jsx(l,{of:p}),`
`,e.jsx(g,{layout:"centered",of:m,sourceState:"none"}),`
`,e.jsx(s,{label:"Overview",level:2}),`
`,e.jsx(r,{githubUrl:"https://github.com/ovh/manager/tree/master/packages/manager-ui-kit/src/components/tags-tile",name:"TagsTile",relatedComponents:[{name:"card",href:i.ods.card},{name:"tag",href:i.ods.tag},{name:"link",href:i.ods.link}],children:e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"TagsTile"})," component displays a tile that shows ",e.jsx(n.strong,{children:"tags"})," (key-value pairs) associated with an item (e.g., a customer, resource, etc.).",e.jsx(n.br,{}),`
`,"It leverages OVHcloud's ODS React components for consistent design and behavior. The component provides a scrollable list of tags and includes an action link to edit tags."]})}),`
`,e.jsx(s,{label:"Anatomy",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ODS Tile"}),": The container that wraps the tags display with a title"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"TagsList"}),": Displays the list of tags in a scrollable area"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"ODS Link"}),": Action link to edit or add tags"]}),`
`]}),`
`,e.jsx(s,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.strong,{children:"TagsTile"})," to display and manage tags associated with resources, customers, or other entities in a consistent tile format."]}),`
`,e.jsx(s,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(c,{dos:["Do use TagsTile to display key-value tag pairs in a structured format","Do provide an onEditTags callback to enable tag management","Do use displayInternalTags to control visibility of internal tags"],donts:["Do not use TagsTile for displaying non-tag related information","Do not use TagsTile without providing tags or handling empty states"]}),`
`,e.jsx(s,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"TagsTile"})," component is typically used within detail pages, resource management interfaces, or anywhere tags need to be displayed and managed in a dedicated tile format."]}),`
`,e.jsx(s,{label:"Behavior",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"States"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Default"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Displays tags in a scrollable container (default 5 lines)"}),`
`,e.jsx(n.li,{children:'Shows "Manage tags" link when tags exist'}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Empty State"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Displays empty state message when no tags are provided"}),`
`,e.jsx(n.li,{children:'Shows "Add tag" link instead of "Manage tags"'}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Hover and focus"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Link interactions follow ODS Link component behavior"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(s,{label:"Variation",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Internationalization (i18n)"})}),`
`,e.jsx(n.p,{children:"The TagsTile component supports the following languages: English, German, Spanish, French (default), Italian, Dutch, Polish and Portuguese."}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Props"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"tags"}),": Object containing key-value pairs of tags to display"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"displayInternalTags"}),": Boolean to control visibility of internal tags (default: false)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"lineNumber"}),": Number of lines to display before scrolling (default: 5)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.code,{children:"onEditTags"}),": Callback function triggered when edit/add tag link is clicked"]}),`
`]}),`
`,e.jsx(s,{label:"Accessiblity",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(d,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move focus to the edit/add tags link"},{key:"Enter",interaction:"Activate the edit/add tags link when focused"},{key:"Arrow Keys",interaction:"Navigate through scrollable tag list when focused"}]}})]})}function B(t={}){const{wrapper:n}={...o(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(a,{...t})}):a(t)}export{B as default};
