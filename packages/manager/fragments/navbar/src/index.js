import React from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import registerFragment from '@ovh-ux/ufrontend/fragment';
import { initReactI18next } from 'react-i18next';
import { Environment } from '@ovh-ux/manager-config';
import Navbar from './navbar.jsx';
import fallbackTranslations from './translations/navbar_fr_FR.json';

registerFragment('navbar').then(({ parent, config }) => {
  const locale = Environment.getUserLocale();
  import(`./translations/navbar_${locale}.json`)
    .catch(() => ({ default: fallbackTranslations }))
    .then(({ default: trads }) => {
      const resources = {
        [locale]: {
          translation: trads,
        },
        fallback: {
          translation: fallbackTranslations,
        },
      };
      i18next.use(initReactI18next).init({
        lng: locale,
        fallbackLng: 'fallback',
        resources,
      });

      ReactDOM.render(
        <React.StrictMode>
          <Navbar
            i18next={i18next}
            universe={config.universe}
            user={config.user}
          />
        </React.StrictMode>,
        parent,
      );
    });
});
