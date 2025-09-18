import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as t}from"./index-BbbfVuzK.js";import{M as l}from"./index-B3OJxjuP.js";import"./index-Bnop-kX6.js";import"./iframe-C_3YMFde.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(i){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...t(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(l,{title:"Guidelines/React Templates/I18N Translations"}),`
`,n.jsx(e.h1,{id:"i18n-translations-implementation",children:"I18N Translations Implementation"}),`
`,n.jsxs(e.p,{children:["This guide outlines how to implement internationalization (i18n) in React applications using the shell client's ",n.jsx(e.code,{children:"initI18n"})," function."]}),`
`,n.jsx(e.h2,{id:"-implementation-steps",children:"📝 Implementation Steps"}),`
`,n.jsx(e.h3,{id:"1-create-i18nts-file",children:"1. Create i18n.ts File"}),`
`,n.jsxs(e.p,{children:["Create an ",n.jsx(e.code,{children:"i18n.ts"})," file in your app's root directory:"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// src/i18n.ts
import i18n from 'i18next';
import I18NextHttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

export default async function initI18n(
  locale = 'fr_FR',
  availablesLocales = ['fr_FR'],
) {
  await i18n
    .use(initReactI18next)
    .use(I18NextHttpBackend)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: (value: string) =>
        value ? value.replace(/&amp;/g, '&') : value,
    })
    .init({
      lng: locale,
      fallbackLng: 'fr_FR',
      supportedLngs: availablesLocales,
      defaultNS: 'common',
      ns: ['common'], // namespaces to load by default
      backend: {
        loadPath: (lngs: string[], namespaces: string[]) =>
          \`\${import.meta.env.BASE_URL}translations/\${namespaces[0]}/Messages_\${
            lngs[0]
          }.json\`,
      },
      postProcess: 'normalize',
    });
  return i18n;
}
`})}),`
`,n.jsx(e.p,{children:"This implementation:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Uses ",n.jsx(e.code,{children:"i18next"})," with HTTP backend for loading translations"]}),`
`,n.jsx(e.li,{children:"Includes a post-processor to normalize HTML entities"}),`
`,n.jsxs(e.li,{children:["Loads translations from JSON files in the ",n.jsx(e.code,{children:"translations"})," directory"]}),`
`,n.jsx(e.li,{children:"Supports multiple locales with French as default"}),`
`,n.jsxs(e.li,{children:["Uses the ",n.jsx(e.code,{children:"common"})," namespace by default"]}),`
`]}),`
`,n.jsx(e.h3,{id:"2-translation-files-structure",children:"2. Translation Files Structure"}),`
`,n.jsx(e.p,{children:"Create translation files in the following structure:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`public/
  translations/
    common/
      Messages_fr_FR.json
      Messages_en_GB.json
`})}),`
`,n.jsx(e.p,{children:"Example translation file:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-json",children:`// public/translations/common/Messages_fr_FR.json
{
  "app_title": "Mon Application",
  "welcome_message": "Bienvenue dans l'application"
}
`})}),`
`,n.jsx(e.h2,{id:"-usage-examples",children:"🎯 Usage Examples"}),`
`,n.jsx(e.h3,{id:"1-using-translations-in-components",children:"1. Using Translations in Components"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('app_title')}</h1>
      <p>{t('welcome_message')}</p>
    </div>
  );
};
`})}),`
`,n.jsx(e.h3,{id:"2-dynamic-translations",children:"2. Dynamic Translations"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useTranslation } from 'react-i18next';

const DynamicComponent = ({ userName }) => {
  const { t } = useTranslation();

  return (
    <div>
      {t('welcome_user', { name: userName })}
    </div>
  );
};
`})}),`
`,n.jsx(e.h3,{id:"3-pluralization",children:"3. Pluralization"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { useTranslation } from 'react-i18next';

const ItemsList = ({ count }) => {
  const { t } = useTranslation();

  return (
    <div>
      {t('items_count', { count })}
    </div>
  );
};
`})}),`
`,n.jsx(e.h2,{id:"-best-practices",children:"✅ Best Practices"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Organization"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Group translations by feature or component"}),`
`,n.jsx(e.li,{children:"Use namespaces for better organization"}),`
`,n.jsx(e.li,{children:"Keep translation keys consistent"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Naming Conventions"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use lowercase with underscores"}),`
`,n.jsx(e.li,{children:"Be descriptive and specific"}),`
`,n.jsx(e.li,{children:"Follow a consistent pattern"}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good
t('button_submit')
t('form_validation_required')
t('page_dashboard_title')

// ❌ Bad
t('submit')
t('required')
t('title')
`})}),`
`,n.jsxs(e.ol,{start:"3",children:[`
`,n.jsxs(e.li,{children:[n.jsx(e.strong,{children:"Dynamic Content"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use variables for dynamic content"}),`
`,n.jsx(e.li,{children:"Provide fallback values"}),`
`,n.jsx(e.li,{children:"Handle pluralization properly"}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good
t('items_count', { count: 5 })
t('welcome_user', { name: userName, defaultValue: 'Welcome' })

// ❌ Bad
t(\`items_\${count}\`)
t('welcome_' + userName)
`})}),`
`,n.jsx(e.h2,{id:"-code-review-checklist",children:"🔍 Code Review Checklist"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] i18n.ts file is properly configured"}),`
`,n.jsx(e.li,{children:"[ ] Translations are initialized before app render"}),`
`,n.jsx(e.li,{children:"[ ] Translation keys follow naming conventions"}),`
`,n.jsx(e.li,{children:"[ ] Dynamic content is properly handled"}),`
`,n.jsx(e.li,{children:"[ ] Pluralization is implemented where needed"}),`
`,n.jsx(e.li,{children:"[ ] Fallback language is specified"}),`
`,n.jsx(e.li,{children:"[ ] Supported languages are defined"}),`
`,n.jsx(e.li,{children:"[ ] Translation files are organized by feature/component"}),`
`]}),`
`,n.jsx(e.h2,{id:"-reference",children:"📚 Reference"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://react.i18next.com/",rel:"nofollow",children:"React-i18next Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.i18next.com/",rel:"nofollow",children:"i18next Documentation"})}),`
`]})]})}function x(i={}){const{wrapper:e}={...t(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(s,{...i})}):s(i)}export{x as default};
