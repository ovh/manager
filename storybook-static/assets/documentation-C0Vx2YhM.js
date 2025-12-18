import{j as t}from"./jsx-runtime-BRNY0I4F.js";import{u as m}from"./index-BjQHK-Oi.js";import{b as n,S as r}from"./index-Bts2vXw7.js";import p from"./useFormatDate.stories-BvoZfnvm.js";import{M as s,S as a}from"./index-DThejhUn.js";import"./index-Bnop-kX6.js";import"./ods-react60-0db41gCx.js";import"./Link-BWQEuWpd-BuJJSBob.js";import"./index-2w0W-O47-BJ19ihbZ.js";import"./ods-react94-Bxf0SjVg.js";import"./lib-BnpaaP8W-1JoBDbah.js";import"./iframe-6yjxaTqs.js";import"./QueryClientProvider-BPX08D6Z.js";import"./index-DnqQo6oJ.js";import"./index-4pTrEEYx.js";import"./Icon-DrfG5m-t-DQEf1CkA.js";import"./Text-CcNd6qQr-D2KuMUPS.js";import"./Badge-YOwwmnsf-CJ8iv41_.js";import"./ods-react236-aAAP9SXj.js";import"./Button-BC-ipw2F-CXZv4wj7.js";import"./Spinner-CV0M2r8z-14hgiywo.js";import"./PopoverTrigger-4w4N6iLp-C-LGD_7X.js";import"./ods-react235-BTQ8kVBe.js";import"./portal-BnVBD_Bd-CMtQ-rJ7.js";import"./use-locale-context-cwTY9VYn-REDUMe7F.js";import"./use-presence-CVI6Oc63-Cg7Clpcl.js";import"./use-event-C16_WYdL-DF4JeFb4.js";import"./index-C7dNzIpW-BlUnPWgK.js";import"./index-BAi52a_A-BVjZSJoF.js";import"./index-DB9CF8IY-DC0Y2KvY.js";import"./TooltipTrigger-Iu3rt7LP-CcHcHvx1.js";import"./index-DDXR4bR2-rx0xkcPf.js";import"./FormFieldLabel-DerGjSSG-BvxIGX_B.js";import"./Card-D5fMAkqX-3SHynhw3.js";import"./Skeleton-tM01pV-R-CR0rfR_T.js";import"./Input-DcqcPYne-DrbRSC9d.js";import"./useI18n-C3-XAdTV-CxpmELcO.js";import"./Divider-THit99OS-DE11lmva.js";import"./Table-DeFepqjL-ijVQdBcH.js";import"./CheckboxLabel-BNqUGOsg-n6RGKdXc.js";import"./use-field-context-C3OOq-03-DvM5qnyl.js";import"./Tag-B7nBeuPX-CPCfmWrN.js";import"./SelectControl-C7d9WPuE-Bxj24dHo.js";import"./index-_7D5ljJ2-LyAubAEn.js";import"./ClipboardTrigger-TeqCWvgk-PkhT1oq0.js";import"./ModalTrigger-tZKHx0Fx-Dgqcdxhl.js";import"./dialog-trigger-DhWI7POy-2Tl6aad4.js";import"./render-strategy-BVcZ76SI-DDawKQXU.js";import"./TabContent-fruP9qhA-B5VnEOA-.js";import"./MessageIcon-yhpEHWAg-BtZxEFo4.js";import"./BreadcrumbItem-elPaHQlb-CNpnNsvr.js";import"./DrawerTrigger-omPTo2Bn-DB5oJcOC.js";import"./DatepickerControl-4VwQb-ep-Ct4shRTG.js";import"./ComboboxControl-sJOkWHeT-CC0kWNMj.js";import"./index-D_fe-3SC-C5ZKsUXO.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function i(o){const e={code:"code",p:"p",pre:"pre",...m(),...o.components};return t.jsxs(t.Fragment,{children:[t.jsx(s,{title:"Manager UI Kit/Hooks/useFormatDate/Documentation"}),`
`,t.jsx(n,{of:p}),`
`,t.jsx(e.p,{children:"The useFormatDate hook leverages date-fns for formatting dates in a localized and customizable way."}),`
`,t.jsx(r,{label:"Output examples",level:2}),`
`,t.jsx(a,{code:`
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
`,t.jsx(r,{label:"Handling invalid or missing dates",level:2}),`
`,t.jsx(a,{code:`formatDate({ date: undefined });
// → "N/A"
formatDate({ date: null });
// → "N/A"
formatDate({ date: '', unknownDateLabel: 'Unknown' });
// → "Unknown"`,language:"ts"}),`
`,t.jsx(r,{label:"Localization",level:2}),`
`,t.jsx(e.p,{children:"The locale is automatically determined from the current i18n.language. Only 8 OVH locale are supported : en_GB, fr_FR, fr_CA, de_DE, es_ES, it_IT, pl_PL, pt_PT. If the locale is unsupported or undefined, it defaults to enGB."}),`
`,t.jsx(e.p,{children:"If you need use locales for another function of date fns you can use useDateFnsLocale"}),`
`,t.jsx(e.p,{children:"This allow easy use and optimize bundle size to import only necessay locale."}),`
`,t.jsx(e.pre,{children:t.jsx(e.code,{className:"language-tsx",children:`const localeFns = useDateFnsLocale();
`})})]})}function ct(o={}){const{wrapper:e}={...m(),...o.components};return e?t.jsx(e,{...o,children:t.jsx(i,{...o})}):i(o)}export{ct as default};
