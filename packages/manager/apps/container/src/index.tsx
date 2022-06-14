import React from 'react';

import { initShell } from '@ovh-ux/shell';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import ReactDOM from 'react-dom';
import { initReactI18next } from 'react-i18next';
import { Environment } from '@ovh-ux/manager-config/types';

import Container from '@/container';
import { ApplicationProvider } from '@/context';
import { initSso } from '@/core/sso';
import { ContainerProvider } from '@/core/container';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import './index.scss';

// avoid container inception
if (window.top !== window.self) {
  window.top.location.href = window.self.location.href;
}

initSso();

initShell().then((shell) => {
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const locale = environment.getUserLocale();
  const config = () => import(`./config-${environment.getRegion()}.js`);

  config()
    .catch(() => {})
    .then(() => {
      i18n
        .use(initReactI18next)
        .use(Backend)
        .init({
          lng: locale,
          fallbackLng: 'fr_FR',
          ns: [], // namespaces to load by default
          backend: {
            // path construction for async load, ns: namespace, lng: locale
            loadPath: (lng: string, ns: string) =>
              `./translations/${ns}/Messages_${lng}.json`,
          },
        });

      ReactDOM.render(
        <React.StrictMode>
          <ApplicationProvider environment={environment} shell={shell}>
            <ContainerProvider>
              <Container />
            </ContainerProvider>
          </ApplicationProvider>
        </React.StrictMode>,
        document.querySelector('#app'),
      );
    });
});
