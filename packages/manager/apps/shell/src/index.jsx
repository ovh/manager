import React from 'react';
import ReactDOM from 'react-dom';

import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { fetchConfiguration } from '@ovh-ux/manager-config';

import { initSso } from '@/core/sso';
import ApplicationContext from './context';
import Shell from '@/shell';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import './index.scss';

initSso();

fetchConfiguration('shell')
  .then((environment) => {
    const locale = environment.getUserLocale();
    i18n
      .use(initReactI18next)
      .use(Backend)
      .init({
        lng: locale,
        fallbackLng: 'fr_FR',
        ns: [], // namespaces to load by default
        backend: {
          // path construction for async load, ns: namespace, lng: locale
          loadPath: './translations/{{ns}}/Messages_{{lng}}.json',
        },
      });
    return environment;
  })
  .then((environment) => {
    ReactDOM.render(
      <React.StrictMode>
        <ApplicationContext.Provider value={{ environment }}>
          <Shell />
        </ApplicationContext.Provider>
      </React.StrictMode>,
      document.querySelector('#app'),
    );
  });
