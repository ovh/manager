import React from 'react';
import ReactDOM from 'react-dom';
import i18next from 'i18next';
import { registerFragment } from '@ovh-ux/ufrontend';
import { initReactI18next } from 'react-i18next';
import Navbar from './navbar.jsx';
import fallbackTranslations from './translations/navbar_fr_FR.json';

import { Provider as EnvironmentProvider } from './environment';

registerFragment('navbar').then(({ parent, environment }) => {
  const locale = environment.getUserLocale();
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
          <EnvironmentProvider value={environment}>
            <Navbar
              universe={environment.getUniverse()}
              user={environment.getUser()}
            />
          </EnvironmentProvider>
        </React.StrictMode>,
        parent,
      );
    });
});
