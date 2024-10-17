import React, { useMemo, RefObject } from 'react';
import { Navigate, Routes, Route } from 'react-router-dom';
import { Application } from '@ovh-ux/manager-config';
import { ExternalApplicationRoute } from './route/external-application-route';
import { IFrameApplicationRoute } from './route/iframe-application-route';
import { IndexRoute } from './route/index-route';
import { Redirections } from './redirections';

export interface IFrameAppRouterProps {
  configuration: Record<string, Application>;
  iframeRef: RefObject<HTMLIFrameElement>;
}

function makeRoute({
  id,
  appConfig,
  iframeRef,
}: {
  id: string;
  appConfig: Application;
  iframeRef: RefObject<HTMLIFrameElement>;
}) {
  const { hash, path } = appConfig.container;
  const normalizedHash = (hash || '').replace(/^\//, '');
  const target = [path || id, normalizedHash, '*'].filter((i) => i).join('/');
  return (
    <Route
      key={id}
      path={target}
      element={
        appConfig.container.enabled ? (
          <IFrameApplicationRoute iframeRef={iframeRef} appConfig={appConfig} />
        ) : (
          <ExternalApplicationRoute appConfig={appConfig} />
        )
      }
    />
  );
}

function makeDefaultRoute({
  configuration,
}: {
  configuration: [string, Application][];
}) {
  const [, defaultApp] =
    configuration.find(
      ([, appConfig]) => appConfig.container.isDefault,
    ) || [];
  if (!defaultApp) {
    return undefined;
  }
  return (
    <Route
      index
      element={
        <Navigate
          to={`${defaultApp.container.path}${defaultApp.container.hash || ''}`}
          replace={true}
        />
      }
    />
  );
}

export function IFrameAppRouter({
  configuration,
  iframeRef,
}: IFrameAppRouterProps): JSX.Element {
  // We order applications configurations by hash size, as a configuration with a hash means we want a route to be
  // redirected to this application. As a result we need to have them first, so they take priority over routes from
  // which we want to be redirected
  const sortedConfiguration = useMemo(() => Object.entries(configuration).sort(([, appAConfig], [, appBConfig]) =>
    (appBConfig.container.hash || "").length - (appAConfig.container.hash || "").length
  ), [configuration])
  const defaultRoute = useMemo(() => makeDefaultRoute({ configuration: sortedConfiguration }), [
    sortedConfiguration,
  ]);
  const routes = useMemo(
    () =>
      sortedConfiguration.map(([id, appConfig]) =>
        makeRoute({ appConfig, iframeRef, id }),
      ),
    [sortedConfiguration],
  );
  const redirections = useMemo(() => Redirections(), []);
  return (
    <Routes>
      {redirections}
      {defaultRoute}
      {routes}
      <Route path="*" element={<IndexRoute />} />
    </Routes>
  );
}

export default IFrameAppRouter;
