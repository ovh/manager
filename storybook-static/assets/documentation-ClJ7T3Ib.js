import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-Dv4BtNcU.js";import{S as o,a as t,b as l,c}from"./index-Ds9YNAQj.js";import{M as d}from"./index-CkAtam5I.js";import p from"./price.stories-D9-G_zf1.js";import{e as r}from"./external-links-BJh_TBGD.js";import"./index-Bnop-kX6.js";import"./lib-B3Fmd3jL-DS3bY-MS.js";import"./iframe-88n6rbmf.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./ods-react94-Bxf0SjVg.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(i){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...a(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Manager UI Kit/Components/Price/Documentation"}),`
`,e.jsx(o,{of:p}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsx(l,{aliases:["Interactive Price","Price Formatter"],githubUrl:r.github.price,name:"Price",relatedComponents:[{name:"ods-text",href:r.ods.text}],children:e.jsx(n.p,{children:`The Price component is a dynamic formatter designed to display prices in a
context-sensitive manner.`})}),`
`,e.jsx(t,{label:"Anatomy",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Value"}),": ODS Text; The numerical price to display"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Currency"}),": derived from the subsidiary, displayed according to locale rules (e.g., € or $)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Subsidiary"}),": a mandatory attribute that determines the formatting style and additional details (e.g., tax labels)"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Locale"}),": adjust number formatting and currency placement:",`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"Decimal separator"}),`
`,e.jsx(n.li,{children:"Currency position: before or after the value"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tax"}),": dynamically calculates and displays the tax-inclusive price based on the applied tax rate"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Interval unit"}),': describes the pricing interval (e.g., "day", "month", "year")']}),`
`]}),`
`,e.jsx(t,{label:"Usage",level:2}),`
`,e.jsxs(n.p,{children:["Use the ",e.jsx(n.strong,{children:"Price"})," component whenever a price needs to be displayed in a way that adapts to regional and tax-specific rules."]}),`
`,e.jsx(t,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(c,{dos:["Do ensure the locale matches the target audience's expectations","Do clearly specify tax rates and interval units when relevant"]}),`
`,e.jsx(t,{label:"Placement",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Price"})," component can be placed inline with text or as a standalone element within pricing card, tile, table, subscription details or product pages."]}),`
`,e.jsx(t,{label:"Behavior",level:2}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"States"})}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Default"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Displays the price with pre-tax and post-tax amounts, currency, and any interval unit (none by default)"}),`
`,e.jsx(n.li,{children:"Formats the value according to the selected locale and subsidiary"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Tax applied"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"The component calculates the tax-inclusive amount based on the subsidiary's rules and diplays it alongside the pre-tax amount"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"With Interval unit"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:'Appends the interval unit to the displayed price from "day", "month" or "year"'}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(n.p,{children:e.jsx(n.strong,{children:"Interactions"})}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Price"})," component does not have interactive states but dynamically reacts to changes in its input (value, subsidiary, locale, tax settings)."]}),`
`,e.jsx(t,{label:"Variation",level:2}),`
`,e.jsxs(n.p,{children:["The ",e.jsx(n.strong,{children:"Price"})," component automatically adapts based on the provided subsidiary and locale, leading to variations in:"]}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"tax labels (e.g., HT/TTC, ex. GST/incl. GST)"}),`
`,e.jsx(n.li,{children:"currency symbols and placement"}),`
`,e.jsx(n.li,{children:"interval unit display"}),`
`]}),`
`,e.jsx(t,{label:"Accessibility",level:2}),`
`,e.jsxs(n.p,{children:[e.jsx(n.em,{children:`Ensure the component meets accessibility standards.
Describe what should keyboard interaction do to the component
WAI Patterns can help you go though keyboard interaction :`})," ",e.jsx(n.strong,{children:e.jsx(n.a,{href:"https://www.w3.org/WAI/ARIA/apg/patterns/",rel:"nofollow",children:"https://www.w3.org/WAI/ARIA/apg/patterns/"})})]}),`
`,e.jsx(n.p,{children:"To ensure accessibility:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Always include descriptive text for the price, such as tax details, currency, and interval units, for screen readers"}),`
`,e.jsx(n.li,{children:"Ensure numeric values are clearly readble and adhere to formatting conventions for the target audience"}),`
`]})]})}function je(i={}){const{wrapper:n}={...a(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(s,{...i})}):s(i)}export{je as default};
