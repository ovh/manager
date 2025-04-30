import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-V5G0nS76.js";import{M as d,S as n,A as o}from"./index-BGHEhVzF.js";import i from"./useFormatDate.stories-CmyFADXa.js";import"./index-Bnop-kX6.js";import"./iframe-Dk1Mz84i.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./useTranslation-DQ7TG6Ul.js";import"./context-BG98Yt4t.js";function r(a){const t={code:"code",h2:"h2",p:"p",pre:"pre",...s(),...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(d,{of:i}),`
`,e.jsx(t.h2,{id:"useformatdate-date-fns",children:"useFormatDate (date-fns)"}),`
`,e.jsx(t.p,{children:"The useFormatDate hook leverages date-fns for formatting dates in a localized and customizable way."}),`
`,e.jsx(t.h2,{id:"usage",children:"Usage"}),`
`,e.jsx(n,{code:`const formatDate = useFormatDate();
formatDate({ date: '2024-09-14T09:21:21.943Z' });
// → "14 Sept 2024" (default format)
`,language:"ts"}),`
`,e.jsx(t.h2,{id:"parameters",children:"Parameters"}),`
`,e.jsx(o,{include:["defaultUnknownLabel"]}),`
`,e.jsx(t.h2,{id:"parameters-of-formatdate",children:"Parameters of formatDate"}),`
`,e.jsx(o,{include:["date","format","unknownDateLabel"]}),`
`,e.jsx(t.h2,{id:"output-examples",children:"Output examples"}),`
`,e.jsx(n,{code:`
const formatDate = useFormatDate();

// Default format (PP)
formatDate({ date: '2024-09-14T09:21:21.943Z' });
// → "14 Sept 2024"

// Custom format with day of the week
formatDate({ date: '2024-09-14T09:21:21.943Z', format: 'PPPP' });
// → "Saturday, 14 September 2024"

// Combined date and time
formatDate({ date: '2024-09-14T09:21:21.943Z', format: 'Pp' });
// → "14/09/2024, 10:21"

// Full date and time with detailed timezone
formatDate({ date: '2024-09-14T09:21:21.943Z', format: 'PPPPpppp' });
// → "Saturday, 14 September 2024 at 10:21:21 GMT+02:00"
`,language:"ts"}),`
`,e.jsx(t.h2,{id:"handling-invalid-or-missing-dates",children:"Handling invalid or missing dates"}),`
`,e.jsx(n,{code:`formatDate({ date: undefined });
// → "N/A"
formatDate({ date: null });
// → "N/A"
formatDate({ date: '', unknownDateLabel: 'Unknown' });
// → "Unknown"`,language:"ts"}),`
`,e.jsx(t.h2,{id:"localization",children:"Localization"}),`
`,e.jsx(t.p,{children:"The locale is automatically determined from the current i18n.language. Only 8 OVH locale are supported : en_GB, fr_FR, fr_CA, de_DE, es_ES, it_IT, pl_PL, pt_PT. If the locale is unsupported or undefined, it defaults to enGB."}),`
`,e.jsx(t.p,{children:"If you need use locales for another function of date fns you can use useDateFnsLocale"}),`
`,e.jsx(t.p,{children:"This allow easy use and optimize bundle size to import only necessay locale."}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-tsx",children:`const localeFns = useDateFnsLocale();
`})})]})}function P(a={}){const{wrapper:t}={...s(),...a.components};return t?e.jsx(t,{...a,children:e.jsx(r,{...a})}):r(a)}export{P as default};
