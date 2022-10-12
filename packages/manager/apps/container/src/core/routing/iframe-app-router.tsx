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
  configuration: Record<string, Application>;
}) {
  const [, defaultApp] =
    Object.entries(configuration).find(
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
  const defaultRoute = useMemo(() => makeDefaultRoute({ configuration }), [
    configuration,
  ]);
  const routes = useMemo(
    () =>
      Object.entries(configuration).map(([id, appConfig]) =>
        makeRoute({ appConfig, iframeRef, id }),
      ),
    [configuration],
  );
  const redirections = useMemo(() => Redirections(), []);
  return (
    <Routes>
      {defaultRoute}
      {routes}
      {redirections}
      <Route path="*" element={<IndexRoute />} />
    </Routes>
  );
}

export default IFrameAppRouter;
