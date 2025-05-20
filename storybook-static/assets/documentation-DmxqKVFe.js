import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-Bprn0JxM.js";import{S as a,a as l,e as r,b as p}from"./external-links-DrU1Db-c.js";import{S as n}from"./index-BDxkekRb.js";import{S as c}from"./index-DeW_46E-.js";import{M as d,C as h}from"./index-MrdEkgLW.js";import x,{Default as m}from"./ManagerText.stories-BhJwj2uz.js";import"./index-Bnop-kX6.js";import"./index-D-q5QNgV.js";import"./index-CNSIveXf.js";import"./index-4pTrEEYx.js";import"./ods-toggle2-BJ1toRrr.js";import"./iframe-trrLRpon.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ManagerButton-C8ATaM6q.js";import"./i18next-6HYnolD1.js";import"./QueryClientProvider-DAxw80nV.js";import"./useOvhTracking-Cqpl1sX8.js";import"./index-CwE47CCN.js";import"./clipboard.component-CmhF-xNN.js";import"./useTranslation-DQ7TG6Ul.js";import"./context-BG98Yt4t.js";import"./Step.component-Bds2cN4H.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./Tabs.component-C_dEyA9f.js";import"./TilesInput.component-C_qU074F.js";import"./card.component-BToc7KuX.js";import"./title.component-ucIeg-_K.js";import"./links.component-DnFRtS4w.js";import"./price.component-CleweYwa.js";import"./translation-DkLW9Uck.js";import"./guide.component-BUB2PtWq.js";import"./changelog.component-bWd8ittI.js";import"./error.component-Mbm_PMBt.js";import"./error-boundary.component-CFspuVW9.js";import"./delete-modal.component-4eOUWoLS.js";import"./click-utils-ByCElPrV.js";import"./update-name-modal.component-BuaziZw6.js";import"./notifications.component-BC7nyudf.js";import"./PciMaintenanceBanner.component-CFf6hjH_.js";import"./region.component-7C7sLsDi.js";import"./Order.component-DWsKGSo7.js";import"./badge.component-WpuLrKbO.js";import"./Modal.component-BFD3_SRS.js";function i(o){const t={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...s(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Components/Manager Text/Documentation"}),`
`,e.jsx(a,{of:x}),`
`,e.jsx(h,{layout:"centered",of:m,sourceState:"none"}),`
`,e.jsx(n,{label:"Overview",level:2}),`
`,e.jsxs(l,{githubUrl:r.github.ManagerText,name:"ManagerText",relatedComponents:[{name:"ods-text",href:r.ods.text},{name:"ods-tooltip",href:r.ods.tooltip}],children:[e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Manager Text"})," component is a wrapper for OdsText with added capability to handle IAM behaviour to displays a text if the user has access to the data, otherwise display a message with a tooltip for additional context. It is designed for interactive usage, with mandatory URN and IAM actions properties to associate the text with external resources."]}),e.jsx(t.p,{children:"The component supports internationalization (i18n)."})]}),`
`,e.jsx(n,{label:"Anatomy",level:2}),`
`,e.jsxs(t.ol,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"ODS Text"}),': it is restricited to the "span" preset; it serves as the trigger for the tooltip']}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"ODS Tooltip"}),": it displays contextual information about the text"]}),`
`]}),`
`,e.jsx(n,{label:"Usage",level:2}),`
`,e.jsxs(t.p,{children:["Use the ",e.jsx(t.strong,{children:"Manager Text"})," to display the information requiring IAM check to display the text."]}),`
`,e.jsx(n,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(p,{dos:["Do use the Manager Text for succinct, content requiring contextual explanations","Do provide valid URN and IAM actions"],donts:["Do not use the Manager Text for purely decorative purposes"]}),`
`,e.jsx(n,{label:"Placement",level:2}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Manager Text"})," component is typically used inline within a table, a paragraph, or alongside other UI elements where additional explanation is necessary."]}),`
`,e.jsx(n,{label:"Behavior",level:2}),`
`,e.jsx(t.p,{children:e.jsx(t.strong,{children:"States"})}),`
`,e.jsxs(t.ul,{children:[`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Default"}),":",`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"The text is visible, and the tooltip is hidden by default"}),`
`]}),`
`]}),`
`,e.jsxs(t.li,{children:[e.jsx(t.strong,{children:"Hover and focus"}),":",`
`,e.jsxs(t.ul,{children:[`
`,e.jsx(t.li,{children:"All inherited from the ODS Tooltip component"}),`
`]}),`
`]}),`
`]}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"Interactions"}),`
Hovering or focusing over the text displays the tooltip.`]}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"URN"}),": links the text to an external resource."]}),`
`,e.jsxs(t.p,{children:[e.jsx(t.strong,{children:"IAM actions"}),": related to IAM policies; One or more ",e.jsx(t.strong,{children:"actions"})," allowed or excepted by an IAM policy."]}),`
`,e.jsx(n,{label:"Variation",level:2}),`
`,e.jsx(t.p,{children:e.jsx(t.strong,{children:"Internationalization (i18n)"})}),`
`,e.jsxs(t.p,{children:["The ",e.jsx(t.strong,{children:"Manage Text"})," component supports the following languages: English, German, Spanish, French (default), Italian, Dutch, Polish and Portuguese."]}),`
`,e.jsx(n,{label:"Accessiblity",level:2}),`
`,e.jsxs(t.p,{children:[e.jsx(t.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(t.strong,{children:e.jsx(t.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(c,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move focus to the text; The tooltip is displayed"}]}})]})}function ae(o={}){const{wrapper:t}={...s(),...o.components};return t?e.jsx(t,{...o,children:e.jsx(i,{...o})}):i(o)}export{ae as default};
