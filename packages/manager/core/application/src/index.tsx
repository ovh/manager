import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ApplicationId } from '@ovh-ux/manager-config';
import { UIKitTheme } from '@ovh-ux/manager-themes';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './query-client';

import './vite-hmr';
import OvhApplication from './ovh-application';
import OvhContext, { OvhContextShellType } from './ovh-context';
import { createAppRouter } from './ovh-routing';

const theme = extendTheme(UIKitTheme);

export function useEnvironment() {
  const { environment } = useContext(OvhContext);
  return environment;
}

export type { OvhContextShellType };

export { queryClient } from './query-client';

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

export function startApplication(
  appName: ApplicationId,
) {
  const root = createRoot(createContainerElement());
  const appRouter = createAppRouter();
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <OvhApplication name={appName}>
            <RouterProvider router={appRouter} />
          </OvhApplication>
        </ChakraProvider>
      </QueryClientProvider>
    </React.StrictMode>,
  );
}

export default startApplication;
