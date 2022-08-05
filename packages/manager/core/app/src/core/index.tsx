import React, { useContext } from 'react';

import { UIKitTheme } from '@ovh-ux/manager-themes';

import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { ApplicationId } from '@ovh-ux/manager-config/types/application';
import OvhApplication from './ovh-application';
import OvhContext from './ovh-context';

const theme = extendTheme(UIKitTheme);

export function useEnvironment() {
  const { environment } = useContext(OvhContext);
  return environment;
}

export function useShell() {
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
  app: React.FunctionComponent,
) {
  const root = createRoot(createContainerElement());
  const AppComponent = app;
  root.render(
    <React.StrictMode>
      <ChakraProvider theme={theme}>
        <OvhApplication name={appName}>
          <AppComponent />
        </OvhApplication>
      </ChakraProvider>
    </React.StrictMode>,
  );
}

export default startApplication;
