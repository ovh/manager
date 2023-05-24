import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { ApplicationId } from '@ovh-ux/manager-config';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './query-client';

import './vite-hmr';
import OvhApplication from './ovh-application';
import OvhContext, {
  OvhContextShellType as OvhContextShellT,
  initOvhContext,
  OvhContextType,
} from './ovh-context';
import { createAppRouter } from './ovh-routing';

import initI18n from './i18n';

export function useEnvironment() {
  const { environment } = useContext(OvhContext);
  return environment;
}

export type OvhContextShellType = OvhContextShellT;

export { queryClient } from './query-client';
export * from './hooks';

export function useShell(): OvhContextShellType {
  const { shell } = useContext(OvhContext);
  return shell;
}

export function createContainerElement() {
  const body = document.querySelector('body');
  const divContainer = document.createElement('div');
  divContainer.id = 'ovh-app';
  body.append(divContainer);
  return divContainer;
}
async function setLocale(context: OvhContextType) {
  const availableLocales = await context.shell.i18n.getAvailableLocales();
  await initI18n(
    context.environment.getUserLocale(),
    availableLocales.map(({ key }) => key),
  );
  return context;
}

export async function startApplication(appName: ApplicationId) {
  const root = createRoot(createContainerElement());
  const appRouter = createAppRouter();
  console.info('entre dans startApplication');
  console.info('startApplication appName : ', appName);

  try {
    const ovhContext = await initOvhContext(appName);
    const contextWithI18n = await setLocale(ovhContext);
    // contextWithI18n.shell.i18n.onLocaleChange(() => {
    //   console.info('entre dans onLocaleChange I18n.shell.i18n')
    //   setLocale(contextWithI18n).then((ctx) => contextWithI18n = ctx)
    // });
    console.info('contextWithI18n :', contextWithI18n);
    root.render(
      <React.StrictMode>
        <OvhContext.Provider value={contextWithI18n}>
          <QueryClientProvider client={queryClient}>
            <React.Suspense fallback={null}>
              <RouterProvider router={appRouter} />
            </React.Suspense>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </OvhContext.Provider>
      </React.StrictMode>,
    );
  } catch (error) {
    console.info('Error Start application');
  }
}

export default startApplication;
