import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import { initShell } from '@ovh-ux/shell';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Environment } from '@ovh-ux/manager-config';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';
import { UIKitTheme } from '@ovh-ux/manager-themes';
import { extendTheme, ChakraProvider } from '@chakra-ui/react';

import Container from '@/container';
import { ApplicationProvider } from '@/context';
import { initSso } from '@/core/sso';
import { setupDevApplication } from '@/core/dev';
import { ContainerProvider } from '@/core/container';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-tooltip/dist/react-tooltip.css';
import './index.scss';

// avoid container inception
if (window.top !== window.self) {
  window.top.location.href = window.self.location.href;
}
const theme = extendTheme(UIKitTheme);
defineApplicationVersion(__VERSION__);

initSso();

initShell().then((shell) => {
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const locale = environment.getUserLocale();
  const config = () => import(`./config-${environment.getRegion()}.js`);

  setupDevApplication(shell);

  config()
    .catch(() => {})
    .then(() => {
      i18n
        .use(initReactI18next)
        .use(Backend)
        .use({
          type: 'postProcessor',
          name: 'normalize',
          process: function process(value: string, key: string) {
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
      const queryClient = new QueryClient();

      root.render(
        <React.StrictMode>
          <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
              <ApplicationProvider environment={environment} shell={shell}>
                <ContainerProvider>
                  <HashRouter>
                    <Container />
                  </HashRouter>
                </ContainerProvider>
              </ApplicationProvider>
            </QueryClientProvider>
          </ChakraProvider>
        </React.StrictMode>,
      );
    });
});
