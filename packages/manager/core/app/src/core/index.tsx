import React, { useContext } from 'react';
import { createRoot } from 'react-dom/client';
import OvhApplication from './ovh-application';
import OvhContext from './ovh-context';

export function useEnvironment() {
  const { environment } = useContext(OvhContext);
  return environment;
}

export function useShell() {
  const { shell } = useContext(OvhContext);
  return shell;
}

export { OvhApplication } from './ovh-application';

export function createContainerElement() {
  const body = document.querySelector('body');
  const divContainer = document.createElement('div');
  divContainer.id = 'ovh-app';
  body.append(divContainer);
  return divContainer;
}

export function startApplication(appName: string, app: JSX.Element) {
  const root = createRoot(createContainerElement());
  const AppComponent = app;
  root.render(
    <React.StrictMode>
      <OvhApplication name={appName}>
        <AppComponent />
      </OvhApplication>
    </React.StrictMode>,
  );
}

export default startApplication;
