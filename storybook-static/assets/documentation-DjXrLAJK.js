import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as a}from"./index-CKllsYU4.js";import{S as l,a as t,b as o,e as s,c}from"./external-links-Bov0Osh9.js";import{M as d}from"./index-B1j-04Z3.js";import h from"./price.stories-BIXF6z5c.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-CbA6Q3A_.js";import"./index-D0sJu8id.js";import"./ods-toggle2-B9ijeUZX.js";import"./iframe-D94QFGAF.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./manager-react-components-lib.es-DhdezO3q.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-DUQbBcJX.js";import"./context-Cuu9iSAu.js";function r(i){const n={a:"a",em:"em",li:"li",ol:"ol",p:"p",strong:"strong",ul:"ul",...a(),...i.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{title:"Manager React Components/Components/Price/Documentation"}),`
`,e.jsx(l,{of:h}),`
`,e.jsx(t,{label:"Overview",level:2}),`
`,e.jsx(o,{aliases:["Interactive Price","Price Formatter"],githubUrl:s.github.price,name:"Price",relatedComponents:[{name:"ods-text",href:s.ods.text}],children:e.jsx(n.p,{children:`The Price component is a dynamic formatter designed to display prices in a
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
`]})]})}function S(i={}){const{wrapper:n}={...a(),...i.components};return n?e.jsx(n,{...i,children:e.jsx(r,{...i})}):r(i)}export{S as default};
