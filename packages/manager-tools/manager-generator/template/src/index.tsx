/**
 * index.tsx
 * -----------------------------------------------------------------------------
 * Application bootstrap entrypoint.
 *
 * Responsibilities:
 * - Initialize the Manager shell context (auth, environment, tracking).
 * - Configure i18n namespaces for onboarding, dashboard, listing.
 * - Load region-specific config dynamically (`config-<region>.js`).
 * - Hydrate the React application under `#root`.
 *
 * @remarks
 * - Tracking context is defined once and injected into the shell.
 * - Falls back gracefully if no region-specific config is found.
 */
import React from 'react';

import ReactDOM from 'react-dom/client';

import { ShellContext, initI18n, initShellContext } from '@ovh-ux/manager-react-shell-client';

import { appName } from '@/App.constants';

import App from './App';
import { APP_NAME, LEVEL2, SUB_UNIVERSE, UNIVERSE } from './Tracking.constants';
import './index.scss';
import './vite-hmr';

/**
 * Analytics & tracking configuration injected into the shell.
 *
 * @remarks
 * - `chapter1..3` define the hierarchy for tracking.
 * - `level2Config` maps region → level2 identifier.
 * - `pageTheme` defines the tracking “theme” (usually the universe).
 */
const trackingContext = {
  chapter1: UNIVERSE,
  chapter2: SUB_UNIVERSE,
  chapter3: APP_NAME,
  appName: APP_NAME,
  pageTheme: UNIVERSE,
  level2Config: LEVEL2,
};

/**
 * Bootstrap the application.
 *
 * @param appName - Application identifier (short slug).
 */
const init = async (appName: string) => {
  // Initialize shell context: auth, env, tracking, APIs
  const context = await initShellContext(appName, trackingContext);

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
