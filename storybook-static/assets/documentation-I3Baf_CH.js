import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-BFHPNJKj.js";import{S as l,a,e as o,b as c}from"./external-links-FTO-GxD2.js";import{S as t}from"./index-BRyOCs0q.js";import{M as d,C as h}from"./index-DBqvKWrU.js";import p,{DefaultProps as m}from"./filters.stories-CzdyI73Y.js";import"./index-Bnop-kX6.js";import"./index-D-q5QNgV.js";import"./index-CNSIveXf.js";import"./index-4pTrEEYx.js";import"./ods-toggle2-BJ1toRrr.js";import"./iframe-lzri3O96.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./index-jll95z9C.js";import"./index-CwE47CCN.js";import"./ManagerButton-DPBrdoml.js";import"./i18next-6HYnolD1.js";import"./QueryClientProvider-DAxw80nV.js";import"./useOvhTracking-Cqpl1sX8.js";import"./clipboard.component-CmhF-xNN.js";import"./useTranslation-DQ7TG6Ul.js";import"./context-BG98Yt4t.js";import"./Step.component-Bds2cN4H.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./Tabs.component-C_dEyA9f.js";import"./TilesInput.component-C_qU074F.js";import"./card.component-BToc7KuX.js";import"./title.component-ucIeg-_K.js";import"./links.component-DnFRtS4w.js";import"./price.component-CleweYwa.js";import"./translation-DkLW9Uck.js";import"./guide.component-Bw7Cznhp.js";import"./changelog.component-bWd8ittI.js";import"./error.component-Mbm_PMBt.js";import"./error-boundary.component-CFspuVW9.js";import"./delete-modal.component-4eOUWoLS.js";import"./click-utils-ByCElPrV.js";import"./update-name-modal.component-BuaziZw6.js";import"./notifications.component-BC7nyudf.js";import"./PciMaintenanceBanner.component-CFf6hjH_.js";import"./region.component-7C7sLsDi.js";import"./Order.component-DWsKGSo7.js";import"./badge.component-WpuLrKbO.js";import"./Modal.component-BFD3_SRS.js";import"./tags-list.component-Cd9H7A1G.js";function r(i){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...s(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Components/Filters/Documentation"}),`
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
`]})]})}function le(i={}){const{wrapper:n}={...s(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{le as default};
