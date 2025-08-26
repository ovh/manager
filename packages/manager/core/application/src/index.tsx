import React, { useContext } from 'react';

import { RouterProvider } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRoot } from 'react-dom/client';

import { ApplicationId } from '@ovh-ux/manager-config';

import OvhApplication from './ovh-application';
import OvhContext, { OvhContextShellType as OvhContextShellT } from './ovh-context';
import { createAppRouter } from './ovh-routing';
import { queryClient } from './query-client';
import './vite-hmr';

export function useEnvironment() {
  const { environment } = useContext(OvhContext) || {};
  return environment;
}

export type OvhContextShellType = OvhContextShellT;

export { queryClient } from './query-client';
export * from './hooks';

export * from './ovh-tracking';

export function useShell(): OvhContextShellType | undefined | null {
  const { shell } = useContext(OvhContext) || {};
  return shell;
}

export function createContainerElement() {
  const body = document.querySelector('body');
  const divContainer = document.createElement('div');
  divContainer.id = 'ovh-app';
  body?.append(divContainer);
  return divContainer;
}

export function startApplication(appName: ApplicationId) {
  const root = createRoot(createContainerElement());
  const appRouter = createAppRouter();
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <OvhApplication name={appName}>
          <RouterProvider router={appRouter} />
        </OvhApplication>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

export default startApplication;
