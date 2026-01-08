import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-BgWqaNhW.js";import{b as a,S as e,c as l,a as p,d as m}from"./index-6rSlS0fE.js";import{M as d,C as c}from"./index-BFzAcuM3.js";import h,{Default as u}from"./Button.stories-B0blO51h.js";import{e as i}from"./external-links-D-zcWSEn.js";import"./index-Bnop-kX6.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react94-Bxf0SjVg.js";import"./iframe-DxxJ0EuQ.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./lib-Z3xjUGyf-DiIwvzym.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";import"./iam.constants-CZSXEnm9.js";function r(n){const o={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...s(),...n.components};return t.jsxs(t.Fragment,{children:[t.jsx(d,{title:"Manager UI Kit/Components/Button/Documentation"}),`
`,t.jsx(a,{of:h}),`
`,t.jsx(c,{layout:"centered",of:u,sourceState:"none"}),`
`,t.jsx(e,{label:"Overview",level:2}),`
`,t.jsx(l,{githubUrl:i.github.managerButton,name:"Button",relatedComponents:[{name:"button",href:i.ods.button},{name:"tooltip",href:i.ods.tooltip}],children:t.jsxs(o.p,{children:["The ",t.jsx(o.strong,{children:"Button"}),` component is a wrapper for Button from ODS that provides an additional capability of disabled Button with an optional
Tooltip for additional context if user does not have access to perform the associated action. It is designed to support actions or events,
with optional URN and IAM actions properties to associate the Tooltip content
with external resources. The component supports internationalization (i18n).`]})}),`
`,t.jsx(e,{label:"Anatomy",level:2}),`
`,t.jsxs(o.ol,{children:[`
`,t.jsxs(o.li,{children:[t.jsx(o.strong,{children:"ODS Button"}),": it is always disabled with customizable label; it serves as the trigger for the Tooltip"]}),`
`,t.jsxs(o.li,{children:[t.jsx(o.strong,{children:"ODS Tooltip"})," (optional): it displays contextual information about the disabled Button; can be omitted if no Tooltip is needed"]}),`
`]}),`
`,t.jsx(e,{label:"Usage",level:2}),`
`,t.jsxs(o.p,{children:["Use the ",t.jsx(o.strong,{children:"Button"})," to provide users with a disabled button display a concise text requiring additional explanation via a tooltip."]}),`
`,t.jsx(e,{label:"Dos & Don'ts",level:2}),`
`,t.jsx(p,{dos:["Do use the Manager Button for succinct, content requiring contextual explanations","Do provide valid URN and IAM actions"],donts:["Do not use the Manager Button for purely decorative purposes"]}),`
`,t.jsx(e,{label:"Placement",level:2}),`
`,t.jsxs(o.p,{children:["The ",t.jsx(o.strong,{children:"Button"})," component is typically used inline within a table, or alongside other UI elements where additional explanation is necessary."]}),`
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
`,t.jsx(m,{data:{columns:["key","interaction"],rows:[{key:"Tab",interaction:"Move focus to the text; The tooltip is displayed"}]}})]})}function yt(n={}){const{wrapper:o}={...s(),...n.components};return o?t.jsx(o,{...n,children:t.jsx(r,{...n})}):r(n)}export{yt as default};
