import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-DtBi2NJp.js";import{b as l,S as o}from"./index-OMuCphBM.js";import i from"./useFormatDate.stories-au-pNHG1.js";import{M as m,S as n}from"./index-0Pa5_OBP.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./manager-react-components-lib.es-Ngpt3Dgi.js";import"./iframe-CsxCAwZL.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function r(a){const t={code:"code",p:"p",pre:"pre",...s(),...a.components};return e.jsxs(e.Fragment,{children:[e.jsx(m,{title:"Manager React Components/Hooks/useFormatDate/Documentation"}),`
`,e.jsx(l,{of:i}),`
`,e.jsx(t.p,{children:"The useFormatDate hook leverages date-fns for formatting dates in a localized and customizable way."}),`
`,e.jsx(o,{label:"Output examples",level:2}),`
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
`,e.jsx(o,{label:"Handling invalid or missing dates",level:2}),`
`,e.jsx(n,{code:`formatDate({ date: undefined });
// → "N/A"
formatDate({ date: null });
// → "N/A"
formatDate({ date: '', unknownDateLabel: 'Unknown' });
// → "Unknown"`,language:"ts"}),`
`,e.jsx(o,{label:"Localization",level:2}),`
`,e.jsx(t.p,{children:"The locale is automatically determined from the current i18n.language. Only 8 OVH locale are supported : en_GB, fr_FR, fr_CA, de_DE, es_ES, it_IT, pl_PL, pt_PT. If the locale is unsupported or undefined, it defaults to enGB."}),`
`,e.jsx(t.p,{children:"If you need use locales for another function of date fns you can use useDateFnsLocale"}),`
`,e.jsx(t.p,{children:"This allow easy use and optimize bundle size to import only necessay locale."}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-tsx",children:`const localeFns = useDateFnsLocale();
`})})]})}function _(a={}){const{wrapper:t}={...s(),...a.components};return t?e.jsx(t,{...a,children:e.jsx(r,{...a})}):r(a)}export{_ as default};
