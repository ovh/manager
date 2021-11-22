import React from 'react';
import ReactDOM from 'react-dom';

import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { fetchConfiguration } from '@ovh-ux/manager-config';
import { plugin, shell as shellApi } from '@ovh-ux/shell';

import { initSso } from '@/core/sso';
import { ApplicationProvider } from '@/context';
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
    // init the Shell
    const shell = shellApi.initShell();
    shell.registerPlugin('i18n', plugin.i18n(shell, environment));

    ReactDOM.render(
      <React.StrictMode>
        <ApplicationProvider environment={environment} shell={shell}>
          <Shell />
        </ApplicationProvider>
      </React.StrictMode>,
      document.querySelector('#app'),
    );
  });
