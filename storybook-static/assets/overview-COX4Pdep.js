import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as i}from"./index-BenGHN5L.js";import{S as o}from"./index-C29aiW5g.js";import{M as a}from"./index-EQhVOb-2.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-DXhrqGIV.js";import"./index-D0sJu8id.js";import"./iframe-BHu8F3gw.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function t(s){const e={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...i(),...s.components};return n.jsxs(n.Fragment,{children:[n.jsx(a,{title:"Core/common-translations/Overview"}),`
`,n.jsx(e.h1,{id:"-common-translations",children:"🌍 Common Translations"}),`
`,n.jsx(o,{label:"Overview",level:2}),`
`,n.jsx(e.p,{children:"The purpose of this package is to maintain the common reusable translations which can be consumed across the µ-apps."}),`
`,n.jsx(e.h2,{id:"-contribute-to-common-translations-package",children:"📝 Contribute to common translations package"}),`
`,n.jsxs(e.p,{children:["Translations are split into multiple folders to facilitate lazy loading with i18next's ",n.jsx(e.a,{href:"https://www.i18next.com/principles/namespaces",rel:"nofollow",children:"namespaces"}),". Each folder must have it's own purpose in the context of it's usage."]}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsx(e.p,{children:"ℹ️ Info"}),`
`,n.jsx(e.p,{children:"Translation keys must be generic and not include any app/module name as prefix/suffix as the content from this package will be made available for all the µ-apps."}),`
`]}),`
`,n.jsx(e.h3,{id:"-adding-a-new-namespace",children:"➕ Adding a new Namespace"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:["Create a new folder in ",n.jsx(e.code,{children:"packages/manager/modules/common-translations/public/translations"})]}),`
`,n.jsxs(e.li,{children:["Add ",n.jsx(e.code,{children:"Messages_fr_FR.json"})," file."]}),`
`,n.jsx(e.li,{children:"Add all the required translations with appropriate keys."}),`
`,n.jsxs(e.li,{children:["Follow the usual translation process of ",n.jsx(e.strong,{children:"Submitting a request"})," to CMT team and then ",n.jsx(e.strong,{children:"Retrieving the translations"})," to make the corresponding changes in other locale files."]}),`
`]}),`
`,n.jsx(e.h3,{id:"-addupdate-translations-in-existing-namespace",children:"🔄 Add/Update translations in existing Namespace"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:["Add/Update the required content with appropriate keys in ",n.jsx(e.code,{children:"Messages_fr_FR.json"})," file."]}),`
`,n.jsxs(e.li,{children:["Follow the usual translation process of ",n.jsx(e.strong,{children:"Submitting a request"})," to CMT team and then ",n.jsx(e.strong,{children:"Retrieving the translations"})," to make the corresponding changes in other locale files."]}),`
`]}),`
`,n.jsx(e.h2,{id:"-consuming-translations-from-the-package",children:"🚀 Consuming translations from the package"}),`
`,n.jsx(e.p,{children:'The "@ovh-ux/manager-common-translations" package provides the following,'}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"Content for all the supported locales."}),`
`,n.jsxs(e.li,{children:["A ",n.jsx(e.code,{children:"NAMESPACES"})," constant to facilitate easy loading of i18next's namespace."]}),`
`]}),`
`,n.jsx(e.p,{children:"To consume the translations provided by the package,"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:"You need to include the package as dependency in your µ-app or other package where you intend to consume it."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-json",children:`{
  ...
  ...
  "dependencies": {
    "@ovh-ux/manager-common-translations": "x.x.x",
    ...
    ...
  }
}
`})}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:"In your React component, you can consume the translations from the package as shown in the below code-snippet."}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const ReactComponent = () => {
  ...
  const { t } = useTranslation(NAMESPACES.<NAMESPACE_NAME>);
  ...

  return (
      ...
      <>{{t('<TRANSLATION_KEY>')}}</>
      ...
  );
}
`})}),`
`]}),`
`]}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsx(e.p,{children:"⚠️ Warning"}),`
`,n.jsxs(e.p,{children:[n.jsx(e.strong,{children:"@ovh-ux/manager-vite-config"})," automatically includes the translation files in the final bundle of the µ-app. If the base config provided by this package is not consumed in your µ-app, it will be your responsibility to add these files in your bundle."]}),`
`]}),`
`,n.jsx(o,{label:"Support",level:2}),`
`,n.jsx(e.p,{children:"For issues, feature requests, or contributions:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Create an issue in the ",n.jsx(e.a,{href:"https://github.com/ovh/manager",rel:"nofollow",children:"GitHub repository"})]}),`
`,n.jsx(e.li,{children:"Follow the contribution guidelines in the repository"}),`
`,n.jsx(e.li,{children:"Ensure all translations are provided for supported languages"}),`
`]})]})}function f(s={}){const{wrapper:e}={...i(),...s.components};return e?n.jsx(e,{...s,children:n.jsx(t,{...s})}):t(s)}export{f as default};
