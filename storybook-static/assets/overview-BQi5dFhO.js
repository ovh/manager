import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-DCFZNcrW.js";import{S as s}from"./index-CCukMZ1B.js";import{M as t}from"./index-MiFoqQyr.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-CbA6Q3A_.js";import"./index-D0sJu8id.js";import"./ods-toggle2-B9ijeUZX.js";import"./iframe-BS6OKKsb.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function r(i){const e={a:"a",code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...l(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(t,{title:"Core/common-translations/Overview"}),`
`,n.jsx(e.h1,{id:"common-translations",children:"Common Translations"}),`
`,n.jsx(s,{label:"Overview",level:2}),`
`,n.jsx(e.p,{children:"The Common Translations module provides a centralized collection of translations for OVHcloud Manager applications. It ensures consistency in user interface text across different languages and regions, making it easier to maintain and update translations across the platform."}),`
`,n.jsx(s,{label:"Key Features",level:2}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Multi-language Support"}),": Includes translations for multiple languages including English (GB), French (FR/CA), German (DE), Spanish (ES), Italian (IT), Polish (PL), and Portuguese (PT)"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Categorized Translations"}),": Organized into logical categories:",`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Actions (common UI actions like save, cancel, delete)"}),`
`,n.jsx(e.li,{children:"Form (form-related messages and validation)"}),`
`,n.jsx(e.li,{children:"Clipboard (copy/paste operations)"}),`
`,n.jsx(e.li,{children:"Bytes (file size units)"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Consistent Formatting"}),": Standardized message format with support for variables"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"TypeScript Support"}),": Full TypeScript type definitions for translation keys"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Easy Integration"}),": Simple import and usage in any Manager application"]}),`
`]}),`
`,n.jsx(s,{label:"Usage",level:2}),`
`,n.jsx(e.p,{children:"To use the common translations in your application:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Install the package:"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`npm install @ovh-ux/manager-common-translations
`})}),`
`,n.jsxs(e.ol,{start:"2",children:[`
`,n.jsx(e.li,{children:"Import and use translations in your application:"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`import { useTranslation } from 'react-i18next';
import '@ovh-ux/manager-common-translations';

function MyComponent() {
  const { t } = useTranslation('common');
  
  return (
    <div>
      <button>{t('actions.save')}</button>
      <p>{t('form.mandatory_fields')}</p>
    </div>
  );
}
`})}),`
`,n.jsx(s,{label:"Translation Categories",level:2}),`
`,n.jsx(e.h3,{id:"actions",children:"Actions"}),`
`,n.jsx(e.p,{children:"Common UI action translations including:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Basic actions (save, cancel, delete)"}),`
`,n.jsx(e.li,{children:"Navigation (back, next, previous)"}),`
`,n.jsx(e.li,{children:"Data operations (load, search, filter)"}),`
`,n.jsx(e.li,{children:"System operations (install, update, configure)"}),`
`]}),`
`,n.jsx(e.h3,{id:"form",children:"Form"}),`
`,n.jsx(e.p,{children:"Form-related translations including:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Field validation messages"}),`
`,n.jsx(e.li,{children:"Required field indicators"}),`
`,n.jsx(e.li,{children:"Character count limits"}),`
`,n.jsx(e.li,{children:"Error messages for various validation types"}),`
`]}),`
`,n.jsx(e.h3,{id:"clipboard",children:"Clipboard"}),`
`,n.jsx(e.p,{children:"Clipboard operation translations:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Copy success/error messages"}),`
`,n.jsx(e.li,{children:"Copy to clipboard action text"}),`
`]}),`
`,n.jsx(e.h3,{id:"bytes",children:"Bytes"}),`
`,n.jsx(e.p,{children:"File size unit translations:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Standard units (B, KB, MB, GB, etc.)"}),`
`,n.jsx(e.li,{children:"Binary units (KiB, MiB, GiB, etc.)"}),`
`]}),`
`,n.jsx(s,{label:"Best Practices",level:2}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Use Translation Keys"}),": Always use translation keys instead of hardcoded strings"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Maintain Consistency"}),": Use existing translations when available instead of creating new ones"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Variable Usage"}),": Use the ",n.jsx(e.code,{children:"{{ variable }}"})," syntax for dynamic content"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Type Safety"}),": Leverage TypeScript types for translation keys to catch errors early"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Testing"}),": Test your application with different languages to ensure proper translation display"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Fallback Handling"}),": Implement proper fallback behavior when translations are missing"]}),`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Context Awareness"}),": Use appropriate translations based on the user's locale and region"]}),`
`]}),`
`,n.jsx(s,{label:"Contributing",level:2}),`
`,n.jsx(e.p,{children:"When adding new translations:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Add translations for all supported languages"}),`
`,n.jsx(e.li,{children:"Follow the existing naming conventions"}),`
`,n.jsx(e.li,{children:"Place translations in the appropriate category"}),`
`,n.jsx(e.li,{children:"Update TypeScript types if adding new keys"}),`
`,n.jsx(e.li,{children:"Test the changes with the translation system"}),`
`]}),`
`,n.jsx(s,{label:"Support",level:2}),`
`,n.jsx(e.p,{children:"For issues, feature requests, or contributions:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Create an issue in the ",n.jsx(e.a,{href:"https://github.com/ovh/manager",rel:"nofollow",children:"GitHub repository"})]}),`
`,n.jsx(e.li,{children:"Follow the contribution guidelines in the repository"}),`
`,n.jsx(e.li,{children:"Ensure all translations are provided for supported languages"}),`
`]})]})}function f(i={}){const{wrapper:e}={...l(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(r,{...i})}):r(i)}export{f as default};
