import { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';

import { initShell, Shell } from '@ovh-ux/shell';
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { Environment, fetchConfiguration } from '@ovh-ux/manager-config';

import { ErrorBanner } from '@ovh-ux/manager-react-components';

import './app.scss';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import { ContainerProvider } from '@/core/container';
import { setupDevApplication } from '@/core/dev';
import { setupZendeskConfig } from '@/container/zendesk';
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

const deleteMatchingCookies = () => {
  const cookies = document.cookie.split(';');
  cookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();
    if (cookieName.startsWith('_biz_') || cookieName.startsWith('_mkto_trk') || cookieName.startsWith('_gcl_au')) {
      // Delete the cookie by setting its expiration date to the past
      document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      // Also try to delete with domain variations
      const domain = window.location.hostname;
      document.cookie = `${cookieName}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      // Try with parent domain
      const domainParts = domain.split('.');
      if (domainParts.length > 2) {
        const parentDomain = domainParts.slice(-2).join('.');
        document.cookie = `${cookieName}=; path=/; domain=.${parentDomain}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    }
  });
}

const App = () => {
  const [error, setError] = useState(null);
  const [environment, setEnvironment] = useState<Environment>(null);
  const [shell, setShell] = useState<Shell>(null);
  const [statusPageURL, setStatusPageURL] = useState<string>();

  // Temporary useEffect to delete cookies
  useEffect(() => {
    deleteMatchingCookies();
  }, []);

  const { error: responseError, isLoading, data } = useQuery<
    Environment,
    { environment: Environment; error?: ApiError }
  >({
    queryKey: ['configuration'],
    queryFn: () => fetchConfiguration('shell'),
    staleTime: 0,
    retry: false,
    refetchInterval: error ? 60000 : false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if ((data || responseError) && !shell) {
      const shellObj = initShell(data || responseError.environment);
      const environmentObj = shellObj.getPlugin('environment').getEnvironment();
      setupI18n(environmentObj.getUserLocale());

      if (environmentObj.getRegion() === 'US') {
        setupZendeskConfig();
      }
      const config = () => import(`./config-${environmentObj.getRegion()}.js`);
      setupDevApplication(shellObj);
      config()
        .catch(() => {})
        .then(() => {
          setShell(shellObj);
          setEnvironment(environmentObj);
        });
    }
    // reload the page when API services are back after maintenance
    // this hack is implemented to avoid reinitialising the shell
    if (data && shell) {
      reloadPage();
    }
  }, [data, responseError]);

  useEffect(() => {
    if (responseError && !error) {
      const { error: errorObj } = responseError;
      setError({
        data: {
          message: `${errorObj.message}`,
        },
      });
      setStatusPageURL(errorObj?.details?.statusPageURL);
    } else if (error && !responseError && !isLoading) {
      setError(null);
    }
  }, [responseError, isLoading]);

  if (!shell) {
    return <></>;
  }

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
