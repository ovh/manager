import { useMemo, RefObject } from 'react';
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
  hash,
}: {
  id: string;
  appConfig: Application;
  iframeRef: RefObject<HTMLIFrameElement>;
  hash?: string;
}) {
  const { path } = appConfig.container;
  const normalizedHash = (hash || '').replace(/^\//, '');
  const target = [path || id, normalizedHash].filter((i) => i).join('/');
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
    configuration.find(([, appConfig]) => appConfig.container.isDefault) || [];
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
  const mockedConfiguration = useMemo(() => {
    const newConfiguration = { ...configuration };
    /**
     * This is a temporary condition to ensure that the new pci-load-balancer µapp configuration
     * overrides the angularjs octavia-load-balancer configuration in case pci-load-balancer config
     * is active.
     *
     * This is temporary and needed during the rewriting of octavia-load-balancer from angularjs to react.
     *
     * @TODO remove this condition when pci-load-balancer µapp is prodded and validated.
     */
    if ('pci-load-balancer' in newConfiguration) {
      delete newConfiguration['octavia-load-balancer'];
    }

    return newConfiguration;
  }, [configuration]);

  const defaultRoute = useMemo(
    () =>
      makeDefaultRoute({ configuration: Object.entries(mockedConfiguration) }),
    [mockedConfiguration],
  );

  const routes = useMemo(
    () =>
      Object.entries(mockedConfiguration)
        .flatMap(([id, appConfig]) =>
          appConfig.container.hashes
            ? appConfig.container.hashes.map((hash) => ({
                id,
                appConfig,
                hash,
              }))
            : {
                id,
                appConfig,
                hash: appConfig.container.hash
                  ? `${appConfig.container.hash}/*`
                  : '*',
              },
        )
        // We order applications configurations by hash size, as a configuration with a hash means we want a route to be
        // redirected to this application. As a result we need to have them first, so they take priority over routes from
        // which we want to be redirected
        .sort(
          ({ hash: hashA }, { hash: hashB }) =>
            (hashB || '').length - (hashA || '').length,
        )
        .map((config) => makeRoute({ ...config, iframeRef })),
    [mockedConfiguration],
  );
  const redirections = useMemo(() => Redirections(configuration), [
    configuration,
  ]);

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
