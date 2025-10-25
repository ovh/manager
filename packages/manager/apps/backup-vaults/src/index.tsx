import React from 'react';

import ReactDOM from 'react-dom/client';

import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import { appName } from '@/App.constants';

import App from './App';
import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from './Tracking.constants';
import './index.scss';
import './vite-hmr';

const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

const init = async (appNameParam: string) => {
  // Initialize shell context: auth, env, tracking, APIs
  const context = await initShellContext(appNameParam, trackingContext);

  // Initialize i18n with default namespaces
  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: ['listing', 'dashboard', 'onboarding'],
  });

  // Configure tracking per region
  const region = context.environment.getRegion();
  context.shell.tracking.setConfig(region, LEVEL2);

  // Try loading region-specific runtime config (optional)
  try {
    await import(`./config-${region}.js`);
  } catch {
    // No-op when region config is absent
  }

  // Mount React app
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element #root not found');
  }

  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ShellContext.Provider value={context}>
        <App />
      </ShellContext.Provider>
    </React.StrictMode>,
  );
};

// Start the app
void init(appName);
