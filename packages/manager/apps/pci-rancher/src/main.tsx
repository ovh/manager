import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ShellContext,
  initShellContext,
} from '@ovh-ux/manager-react-shell-client';
import App from './App';
import initI18n from './i18n';

import './index.scss';

import '@/vite-hmr';

const init = async (
  appName: string,
  { reloadOnLocaleChange, mockNetwork } = {
    reloadOnLocaleChange: false,
    mockNetwork: false,
  },
) => {
  if (mockNetwork) {
    const { setupMocks } = await import('../mocks/setup');
    await setupMocks();
  }
  const context = await initShellContext(appName);

  const region = context.environment.getRegion();
  try {
    await import(`./config-${region}.js`);
  } catch (error) {
    // nothing to do
  }

  const locales = await context.shell.i18n.getAvailableLocales();

  const i18n = await initI18n(
    context.environment.getUserLocale(),
    locales.map(({ key }) => key),
  );

  context.shell.i18n.onLocaleChange(({ locale }: { locale: string }) => {
    if (reloadOnLocaleChange) {
      window.top?.location.reload();
    } else {
      i18n.changeLanguage(locale);
    }
  });

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

init('pci-rancher', {
  reloadOnLocaleChange: true,
  mockNetwork:
    process.env.NODE_ENV === 'development' &&
    import.meta.env.VITE_TEST_BDD === 'true',
});
