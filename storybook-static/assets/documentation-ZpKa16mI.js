import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-CPoBZ_ZX.js";import{S as a,a as l,e as i,b as p}from"./external-links-Bs9SR70o.js";import{S as e}from"./index-C-XxG60z.js";import{S as d}from"./index-DeW_46E-.js";import{M as c,C as m}from"./index-CWgF_XZe.js";import h,{Default as u}from"./ManagerButton.stories-DoRH4uAb.js";import"./index-Bnop-kX6.js";import"./index-D-q5QNgV.js";import"./index-CNSIveXf.js";import"./index-4pTrEEYx.js";import"./ods-toggle2-BJ1toRrr.js";import"./iframe-CQSFgxWU.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./ManagerButton-DTyJ8vI1.js";import"./i18next-6HYnolD1.js";import"./QueryClientProvider-DAxw80nV.js";import"./useOvhTracking-Cqpl1sX8.js";import"./index-CwE47CCN.js";import"./clipboard.component-CmhF-xNN.js";import"./useTranslation-DQ7TG6Ul.js";import"./context-BG98Yt4t.js";import"./Step.component-Bds2cN4H.js";import"./clsx-B-dksMZM.js";import"./v4-CQkTLCs1.js";import"./Tabs.component-C_dEyA9f.js";import"./TilesInput.component-C_qU074F.js";import"./card.component-BToc7KuX.js";import"./title.component-ucIeg-_K.js";import"./links.component-DnFRtS4w.js";import"./price.component-CleweYwa.js";import"./translation-DkLW9Uck.js";import"./guide.component-Bw7Cznhp.js";import"./changelog.component-bWd8ittI.js";import"./error.component-Mbm_PMBt.js";import"./error-boundary.component-CFspuVW9.js";import"./delete-modal.component-4eOUWoLS.js";import"./click-utils-ByCElPrV.js";import"./update-name-modal.component-BuaziZw6.js";import"./notifications.component-BC7nyudf.js";import"./PciMaintenanceBanner.component-CFf6hjH_.js";import"./region.component-7C7sLsDi.js";import"./Order.component-DWsKGSo7.js";import"./badge.component-WpuLrKbO.js";import"./Modal.component-BFD3_SRS.js";import"./tags-list.component-Cd9H7A1G.js";function r(n){const o={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...s(),...n.components};return t.jsxs(t.Fragment,{children:[t.jsx(c,{title:"Components/Manager Button/Documentation"}),`
`,t.jsx(a,{of:h}),`
`,t.jsx(m,{layout:"centered",of:u,sourceState:"none"}),`
`,t.jsx(e,{label:"Overview",level:2}),`
`,t.jsx(l,{githubUrl:i.github.managerButton,name:"ManagerButton",relatedComponents:[{name:"ods-button",href:i.ods.button},{name:"ods-tooltip",href:i.ods.tooltip}],children:t.jsxs(o.p,{children:["The ",t.jsx(o.strong,{children:"Manager Button"}),` component is a wrapper for OdsButton that provides an additional capability of disabled Button with an optional
Tooltip for additional context if user does not have access to perform the associated action. It is designed to support actions or events,
with optional URN and IAM actions properties to associate the Tooltip content
with external resources. The component supports internationalization (i18n).`]})}),`
`,t.jsx(e,{label:"Anatomy",level:2}),`
`,t.jsxs(o.ol,{children:[`
`,t.jsxs(o.li,{children:[t.jsx(o.strong,{children:"ODS Button"}),": it is always disabled with customizable label; it serves as the trigger for the Tooltip"]}),`
`,t.jsxs(o.li,{children:[t.jsx(o.strong,{children:"ODS Tooltip"})," (optional): it displays contextual information about the disabled Button; can be omitted if no Tooltip is needed"]}),`
`]}),`
`,t.jsx(e,{label:"Usage",level:2}),`
`,t.jsxs(o.p,{children:["Use the ",t.jsx(o.strong,{children:"Manager Button"})," to provide users with a disabled button display a concise text requiring additional explanation via a tooltip."]}),`
`,t.jsx(e,{label:"Dos & Don'ts",level:2}),`
`,t.jsx(p,{dos:["Do use the Manager Button for succinct, content requiring contextual explanations","Do provide valid URN and IAM actions"],donts:["Do not use the Manager Button for purely decorative purposes"]}),`
`,t.jsx(e,{label:"Placement",level:2}),`
`,t.jsxs(o.p,{children:["The ",t.jsx(o.strong,{children:"Manager Button"})," component is typically used inline within a table, or alongside other UI elements where additional explanation is necessary."]}),`
`,t.jsx(e,{label:"Behavior",level:2}),`
`,t.jsx(o.p,{children:t.jsx(o.strong,{children:"States"})}),`
`,t.jsxs(o.ul,{children:[`
`,t.jsxs(o.li,{children:[t.jsx(o.strong,{children:"Default"}),":",`
`,t.jsxs(o.ul,{children:[`
`,t.jsx(o.li,{children:"The text is visible, and the tooltip is hidden by default"}),`
`]}),`
`]}),`
`,t.jsxs(o.li,{children:[t.jsx(o.strong,{children:"Hover and focus"}),":",`
`,t.jsxs(o.ul,{children:[`
`,t.jsx(o.li,{children:"All inherited from the ODS Tooltip component"}),`
`]}),`
`]}),`
`]}),`
`,t.jsx(e,{label:"Variation",level:2}),`
`,t.jsx(o.p,{children:t.jsx(o.strong,{children:"Internationalization (i18n)"})}),`
`,t.jsx(o.p,{children:"The Manage Text component supports the following languages: English, German, Spanish, French (default), Italian, Dutch, Polish and Portuguese."}),`
`,t.jsx(e,{label:"Accessiblity",level:2}),`
`,t.jsxs(o.p,{children:[t.jsx(o.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",t.jsx(o.strong,{children:t.jsx(o.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,t.jsx(d,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move focus to the text; The tooltip is displayed"}]}})]})}function lt(n={}){const{wrapper:o}={...s(),...n.components};return o?t.jsx(o,{...n,children:t.jsx(r,{...n})}):r(n)}export{lt as default};
