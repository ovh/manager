import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-DqmHFHkp.js";import{b as a,S as n,c as l,a as c,d}from"./index-CAPBtKJM.js";import{M as p,C as m}from"./index-B5IwYQPI.js";import h,{DemoTagsTile as g}from"./tags-tile.stories-BxNFEsXk.js";import{e as s}from"./external-links-D-zcWSEn.js";import"./index-Bnop-kX6.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react94-Bxf0SjVg.js";import"./iframe-CMtJSjaz.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./lib-sJyaz0Xv-D87u2is_.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";function o(i){const t={a:"a",br:"br",code:"code",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...r(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(p,{title:"Manager UI Kit/Components/TagsTile/Documentation"}),`
`,e.jsx(a,{of:h}),`
`,e.jsx(m,{layout:"centered",of:g,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsx(l,{githubUrl:"https://github.com/ovh/manager/tree/master/packages/manager-ui-kit/src/components/tags-tile",name:"TagsTile",relatedComponents:[{name:"card",href:s.ods.card},{name:"tag",href:s.ods.tag},{name:"link",href:s.ods.link}],children:e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"TagsTile"})," component displays a tile that shows ",e.jsx(t.strong,{children:"tags"})," (key-value pairs) associated with an item (e.g., a customer, resource, etc.).",e.jsx(t.br,{}),`
`,"It leverages OVHcloud's ODS React components for consistent design and behavior. The component provides a scrollable list of tags and includes an action link to edit tags."]})}),`
`,e.jsx(n,{label:"Anatomy",level:2}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"ODS Tile"}),": The container that wraps the tags display with a title"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"TagsList"}),": Displays the list of tags in a scrollable area"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"ODS Link"}),": Action link to edit or add tags"]}),`
`]}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(t.p,{children:["Use the ",e.jsx(t.strong,{children:"TagsTile"})," to display and manage tags associated with resources, customers, or other entities in a consistent tile format."]}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(c,{dos:["Do use TagsTile to display key-value tag pairs in a structured format","Do provide an onEditTags callback to enable tag management","Do use displayInternalTags to control visibility of internal tags"],donts:["Do not use TagsTile for displaying non-tag related information","Do not use TagsTile without providing tags or handling empty states"]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"TagsTile"})," component is typically used within detail pages, resource management interfaces, or anywhere tags need to be displayed and managed in a dedicated tile format."]}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsx(t.p,{children:e.jsx(t.strong,{children:"States"})}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Default"}),":",`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Displays tags in a scrollable container (default 5 lines)"}),`
`,e.jsx(t.li,{children:'Shows "Manage tags" link when tags exist'}),`
`]}),`
`]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Empty State"}),":",`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Displays empty state message when no tags are provided"}),`
`,e.jsx(t.li,{children:'Shows "Add tag" link instead of "Manage tags"'}),`
`]}),`
`]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Hover and focus"}),":",`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"Link interactions follow ODS Link component behavior"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n,{label:"Variation",level:2}),`
`,e.jsx(t.p,{children:e.jsx(t.strong,{children:"Internationalization (i18n)"})}),`
`,e.jsx(t.p,{children:"The TagsTile component supports the following languages: English, German, Spanish, French (default), Italian, Dutch, Polish and Portuguese."}),`
`,e.jsx(t.p,{children:e.jsx(t.strong,{children:"Props"})}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"tags"}),": Object containing key-value pairs of tags to display"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"displayInternalTags"}),": Boolean to control visibility of internal tags (default: false)"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"lineNumber"}),": Number of lines to display before scrolling (default: 5)"]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.code,{children:"onEditTags"}),": Callback function triggered when edit/add tag link is clicked"]}),`
`]}),`
`,e.jsx(n,{label:"Accessiblity",level:2}),`
`,e.jsxs(t.p,{children:[e.jsx(t.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(t.strong,{children:e.jsx(t.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(d,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move focus to the edit/add tags link"},{key:"Enter",interaction:"Activate the edit/add tags link when focused"},{key:"Arrow Keys",interaction:"Navigate through scrollable tag list when focused"}]}})]})}function ye(i={}){const{wrapper:t}={...r(),...i.components};return t?e.jsx(t,{...i,children:e.jsx(o,{...i})}):o(i)}export{ye as default};
