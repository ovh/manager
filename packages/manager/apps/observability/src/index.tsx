import React from 'react';

import ReactDOM from 'react-dom/client';

import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import { appName } from '@/App.constants';

import App from './App';
import './index.scss';
import './vite-hmr';

const init = async (appName: string) => {
  // Initialize shell context: auth, env, tracking, APIs
  const context = await initShellContext(appName);

  // Initialize i18n with default namespaces
  await initI18n({
    context,
    reloadOnLocaleChange: true,
    defaultNS: appName,
    ns: ['listing', 'dashboard', 'onboarding'],
  });

  // Configure tracking per region
  const region = context.environment.getRegion();  

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
