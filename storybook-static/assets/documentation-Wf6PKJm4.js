import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-Bx1eq7v7.js";import{S as l,a as t,b as a,c}from"./index-CsjsX6cP.js";import{M as d,C as h}from"./index-B-I6kpiX.js";import p,{DefaultProps as m}from"./filters.stories-rsY2q4L1.js";import{e as o}from"./external-links-BJh_TBGD.js";import"./index-Bnop-kX6.js";import"./lib-BnpaaP8W-BFi97qs_.js";import"./iframe-CLFETaw5.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-DZGBJQ4L.js";function r(i){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...s(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Manager UI Kit/Components/Filters/Documentation"}),`
`,e.jsx(l,{of:p}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Filters"}),' component provides an "interface" to create and manage filters using a combination of user inputs and predefined conditions.']}),`
`,e.jsx(h,{of:m,sourceState:"none"}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsxs(a,{aliases:["Filters tags","Search Filters"],githubUrl:o.github.filters,name:"Filters",relatedComponents:[{name:"odsDatepicker",href:o.ods.datepicker},{name:"odsFormField",href:o.ods.formField},{name:"odsInput",href:o.ods.input},{name:"odsSelect",href:o.ods.select},{name:"odsTag",href:o.ods.tag}],children:[e.jsx(n.p,{children:"It facilitates:"}),e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"adding filter tags directly via the main Input and Button"}),`
`,e.jsx(n.li,{children:"adding more complexe filters through a Menu (Button + Popover)"}),`
`]})]}),`
`,e.jsx(t,{label:"Anatomy",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Input"}),": ODS Input; Allows the user to type a search term"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Button"})," (magnifying glass icon): ODS Button; Triggers the addition of a tag base on the Input field value"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Button"})," (filter icon): ODS Button; Opens an ODS Popover for advanced filter creation"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Popover"}),": ODS Popover; Contains the following form elements:"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Actions"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"An ODS Select"}),": for choosing the field to filter on (e.g., column)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"A second ODS Select"}),': for choosing a filetring condition (e.g., "contains", "starts with")']}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"An ODS Input"}),": for specifying the value to filter by"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"An ODS Button"}),": for submitting the form elements and adding a filter tag"]}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tag(s)"}),": ODS Tag; Display the added filters and allow removal"]}),`
`]}),`
`,e.jsx(t,{label:"Usage",level:2}),`
`,e.jsx(c,{dos:["Do use Filter component to enhance user experience in data exploration and management interfaces","Do ensure proper configuration of Select options and Input fields to align with the application's requirements"],donts:["Do not use the Filter component if tagging functionnality or advanced filtering is unnecessary","Avoid overcomplicating the Popover with unrelated controls or logic"]}),`
`,e.jsx(t,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Filter"})," component is typically placed above or alongside a Datagrid or data display interface."]}),`
`,e.jsx(n.p,{children:"It should be easily accessible to users for quick filtering actions."}),`
`,e.jsx(t,{label:"Behavior",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"States"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Default"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The Input and Buttons are ready for user interactions"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Hover, focus, click"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"All inherited from the OVHcloud Design System components"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Interactions"})}),`
`,e.jsx(n.p,{children:"Direct Input filtering"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"User types a value into the Input field"}),`
`,e.jsx(n.li,{children:"User clicks the Button (magnifying-glass icon)"}),`
`,e.jsx(n.li,{children:"A tag is added below the Input field"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Advanced filtering (via Popover)"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"User clicks the Button (filter icon) to open the Popover"}),`
`,e.jsxs(n.li,{children:["In the Popover:",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"user selects an option in the first Select"}),`
`,e.jsx(n.li,{children:"user selects a condition in the second Select"}),`
`,e.jsx(n.li,{children:"user types a value into the Input field"}),`
`,e.jsx(n.li,{children:"the Button to submit becomes enabled"}),`
`]}),`
`]}),`
`,e.jsx(n.li,{children:'User clicks the Button "add", and a tag is added below the Input field'}),`
`,e.jsx(n.li,{children:"The Popover remains open for additional filter creation"}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Tag removal"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Clicking the tag deletes it"}),`
`]}),`
`,e.jsx(t,{label:"Variation",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Locale and language"})}),`
`,e.jsx(n.p,{children:`The labels in the Popover (e.g., "Column", "Condition", "Value", "Add") are (or can be) localized to match the application's language.`}),`
`,e.jsx(t,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(n.p,{children:"To meet accessibility standards:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Ensure all form elements in the Popover have clear and descriptive labels"}),`
`,e.jsx(n.li,{children:"Users should be able to navigate through the Input, Buttons, and Popover elements using keyboard controls"}),`
`]})]})}function ve(i={}){const{wrapper:n}={...s(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{ve as default};
