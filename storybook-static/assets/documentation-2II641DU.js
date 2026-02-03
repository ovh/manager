import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-CUIskjj6.js";import{b as i,S as a}from"./index-D0iyo7GC.js";import m from"./useFormatDate.stories-BZ8cfUdh.js";import{M as l,S as n}from"./index-BRK_XPYQ.js";import"./index-Bnop-kX6.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-B5_veLQO.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./lib-D44cvI9Y-BwqRLB_Z.js";import"./iframe-Bmn67lXx.js";import"./QueryClientProvider-BPX08D6Z.js";import"./with-selector-CbDTc_Tw.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./ComboboxControl-sJOkWHeT-DJbuE-Pm.js";import"./ods-react236-aAAP9SXj.js";import"./MessageIcon-yhpEHWAg-CXHPnT2G.js";import"./Divider-THit99OS-BLm7oKDW.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function r(o){const t={code:"code",p:"p",pre:"pre",...s(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"Manager UI Kit/Hooks/useFormatDate/Documentation"}),`
`,e.jsx(i,{of:m}),`
`,e.jsx(t.p,{children:"The useFormatDate hook leverages date-fns for formatting dates in a localized and customizable way."}),`
`,e.jsx(a,{label:"Output examples",level:2}),`
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
`,e.jsx(a,{label:"Handling invalid or missing dates",level:2}),`
`,e.jsx(n,{code:`formatDate({ date: undefined });
// → "N/A"
formatDate({ date: null });
// → "N/A"
formatDate({ date: '', unknownDateLabel: 'Unknown' });
// → "Unknown"`,language:"ts"}),`
`,e.jsx(a,{label:"Localization",level:2}),`
`,e.jsx(t.p,{children:"The locale is automatically determined from the current i18n.language. Only 8 OVH locale are supported : en_GB, fr_FR, fr_CA, de_DE, es_ES, it_IT, pl_PL, pt_PT. If the locale is unsupported or undefined, it defaults to enGB."}),`
`,e.jsx(t.p,{children:"If you need use locales for another function of date fns you can use useDateFnsLocale"}),`
`,e.jsx(t.p,{children:"This allow easy use and optimize bundle size to import only necessay locale."}),`
`,e.jsx(t.pre,{children:e.jsx(t.code,{className:"language-tsx",children:`const localeFns = useDateFnsLocale();
`})})]})}function L(o={}){const{wrapper:t}={...s(),...o.components};return t?e.jsx(t,{...o,children:e.jsx(r,{...o})}):r(o)}export{L as default};
