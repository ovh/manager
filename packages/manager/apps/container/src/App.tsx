import { useState, useEffect, useLayoutEffect } from 'react';
import { HashRouter } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { initShell, Shell, completeShellWithEnvironment, updateShellPlugins } from '@ovh-ux/shell';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { detectUserLocale, Environment, fetchConfiguration, findAvailableLocale, HOSTNAME_REGIONS } from '@ovh-ux/manager-config';

import { ErrorBanner } from '@ovh-ux/manager-react-components';

import './app.scss';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ContainerProvider } from '@/core/container';
import { setupDevApplication } from '@/core/dev';
import { ApplicationProvider } from '@/context';
import Container from '@/container';
import { ApiError } from './types/error.type';

function reloadPage() {
  window.location.reload();
}

function setupI18n(locale: string) {
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
      load: 'currentOnly',
      backend: {
        // path construction for async load, ns: namespace, lng: locale
        loadPath: (lngs: string[], namespaces: string[]) => {
          return `./translations/${namespaces[0]}/Messages_${lngs[0]}.json`;
        },
      },
      postProcess: 'normalize',
    });
}

const App = () => {
  const [error, setError] = useState(null);
  const [environment, setEnvironment] = useState<Environment>(null);
  const [shell, setShell] = useState<Shell>(initShell());
  const [statusPageURL, setStatusPageURL] = useState<string>();

  const { error: responseError, isLoading, data } = useQuery<
    Environment,
    { environment: Environment; error?: ApiError }
  >({
    queryKey: ['configuration'],
    queryFn: () => {
      if (!responseError) {
        const env = new Environment();
        const errorObj = new Error('Server::InternalServerError::ApiUnreachableMaintenance');
        Object.assign(errorObj, { error: errorObj, environment: env });
        throw errorObj;
      }
      return fetchConfiguration('shell')
    },
    staleTime: 0,
    retry: false,
    refetchInterval: error ? 60000 : false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    setupI18n(findAvailableLocale(detectUserLocale(), HOSTNAME_REGIONS[window.location.hostname] || undefined));
  }, []);

  useLayoutEffect(() => {
    const finalizeInitialization = async () => {
      if ((data || responseError)) {
        const currentEnvironmentPlugin = shell.getPlugin('environment');
        // We don't want to do these actions in case we received an error and then receive a valid response
        if (!currentEnvironmentPlugin) {
          completeShellWithEnvironment(shell, data || responseError.environment);
          const environmentObj = shell.getPlugin('environment').getEnvironment();
          const config = () => import(`./config-${environmentObj.getRegion()}.js`);
          try {
            await config();
          }
          catch(_) {}
        }
        else {
          updateShellPlugins(shell, data || responseError.environment);
        }
        setupDevApplication(shell);
        setShell(shell);
        setEnvironment(shell.getPlugin('environment').getEnvironment());
      }
    }

    finalizeInitialization();
  }, [data, responseError]);

  useEffect(() => {
    if (responseError && !error) {
      const { error: errorObj } = responseError;
      setError({
        data: {
          message: errorObj.message,
        },
      });
      setStatusPageURL(errorObj?.details?.statusPageURL);
    } else if (error && !responseError && !isLoading) {
      setError(null);
    }
  }, [responseError, isLoading]);

  return (
    <>
      {!error ? (
        <>
          <ApplicationProvider environment={environment} shell={shell}>
            <ContainerProvider>
              <HashRouter>
                <Container />
              </HashRouter>
            </ContainerProvider>
          </ApplicationProvider>
        </>
      ) : (
        <div className="error d-flex flex-col">
          <ErrorBanner error={error} onReloadPage={reloadPage} />
          {// classes to match MRC component's class
          statusPageURL && (
            <div className="max-w-[600px] mx-auto px-5 flex items-center gap-4">
              <OsdsIcon name={ODS_ICON_NAME.INFO_CIRCLE}></OsdsIcon>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                level={ODS_TEXT_LEVEL.subheading}
              >
                Check{' '}
                <OsdsLink
                  href={statusPageURL}
                  color={ODS_THEME_COLOR_INTENT.primary}
                  target={OdsHTMLAnchorElementTarget._blank}
                >
                  Status page
                </OsdsLink>{' '}
                for more information
              </OsdsText>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default App;
