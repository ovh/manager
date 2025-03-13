import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';

import { defineApplicationVersion } from '@ovh-ux/request-tagger';

import Restricted from './restricted/Restricted';
import Context, { Auth } from './context';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'font-awesome/css/font-awesome.min.css';
import './index.scss';

let auth: Auth = {};
let ovhSubsidiary: string;
const url = new URL(window.top.location.href);
const region = url.searchParams.get('region') || 'EU';
const locale = url.searchParams.get('locale') || 'en_GB';

const importConfig = () => import(`./config-${region}.js`).catch(() => {});

const fetchAuth = async () => {
  try {
    const request = await fetch('/engine/apiv6/auth/details');
    auth = (await request.json()) as Auth;
  } catch (error) {
    auth = null;
  }
};

const fetchMe = async () => {
  try {
    const request = await fetch('/engine/apiv6/me');
    ovhSubsidiary = (await request.json())?.ovhSubsidiary;
  } catch (error) {
    ovhSubsidiary = null;
  }
};

defineApplicationVersion(__VERSION__);

const App = () => {
  const [appLocale, setLocale] = useState(locale);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  return (
    <Context.Provider
      value={{
        auth,
        isSidebarVisible,
        locale: appLocale,
        ovhSubsidiary,
        region,
        setIsSidebarVisible,
        setLocale,
      }}
    >
      <Restricted />
    </Context.Provider>
  );
};

Promise.all([importConfig(), fetchAuth(), fetchMe()]).then(() => {
  i18n
    .use(initReactI18next)
    .use(Backend)
    .use({
      type: 'postProcessor',
      name: 'normalize',
      process: function process(value: string) {
        if (!value) {
          return value;
        }
        return value.replace(/&amp;/g, '&');
      },
    })
    .init({
      lng: locale,
      fallbackLng: 'fr_FR',
      ns: [], // namespaces to load by default
      backend: {
        // path construction for async load, ns: namespace, lng: locale
        loadPath: (lngs: string[], namespaces: string[]) => {
          return `./translations/${namespaces[0]}/Messages_${lngs[0]}.json`;
        },
      },
      postProcess: 'normalize',
    });

  const root = createRoot(document.querySelector('#app'));

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

// Test Comment to verify new deploy model on 13/03
