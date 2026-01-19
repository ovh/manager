import { useContext, Suspense, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { init, loadRemote } from '@module-federation/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouterDOM from 'react-router-dom';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

function App() {
  const context = useContext(ShellContext);
  const [RemoteApp, setRemoteApp] = useState<any>(null);

  useEffect(() => {
    init({
      name: 'webDomainsHost',
      remotes: [
        {
          name: 'webDomainsMfe',
          entry: 'http://localhost:3001/remoteEntry.js',
          alias: 'webDomainsMfe',
          type: 'esm',
        },
      ],
      shared: {
        react: {
          version: '18.2.0',
          scope: 'default',
          lib: () => React,
          shareConfig: {
            singleton: true,
            requiredVersion: '18.2.0',
          },
        },
        'react-dom': {
          version: '18.2.0',
          scope: 'default',
          lib: () => ReactDOM,
          shareConfig: {
            singleton: true,
            requiredVersion: '18.2.0',
          },
        },
        'react-router-dom': {
          version: '6.16.0',
          scope: 'default',
          lib: () => ReactRouterDOM,
          shareConfig: {
            singleton: true,
            requiredVersion: '6.16.0',
          },
        },
      },
    });

    loadRemote<{ default: React.ComponentType<any> }>('webDomainsMfe/App')
      .then((module) => {
        setRemoteApp(() => module.default);
      })
      .catch((err) => {
        console.error('Failed to load remote:', err);
      });
  }, []);

  console.log('Host - ShellContext value:', context);
  console.log('Host - Shell object:', context?.shell);

  if (!RemoteApp) {
    return <div>Loading web domains...</div>;
  }

  // Enrichir le shellContext avec i18n
  const contextWithI18n = {
    ...context,
    i18n,
  };

  const router = createHashRouter([
    {
      path: '*',
      element: <RemoteApp shellContext={contextWithI18n} />,
    },
  ]);

  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div>Loading web domains...</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </I18nextProvider>
  );
}

export default App;
