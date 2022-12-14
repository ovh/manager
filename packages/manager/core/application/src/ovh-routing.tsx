import React, { lazy, useEffect, Fragment, Suspense } from 'react';
import {
  useLocation,
  RouteObject,
  createHashRouter,
  Outlet,
  LoaderFunction,
  ActionFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from 'react-router-dom';
import {
  generateRegularRoutes,
  generatePreservedRoutes,
} from 'generouted/core';

import { useShell } from '.';

type Element = () => JSX.Element;
type Module = {
  default: Element;
  loader: LoaderFunction;
  action: ActionFunction;
  ErrorElement: Element;
  breadcrumb: () => unknown;
};

function OvhContainerRoutingSync(): JSX.Element {
  const location = useLocation();

  const shell = useShell();
  useEffect(() => {
    shell.routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    shell.routing.onHashChange();
  }, [location]);
  return undefined;
}

function buildRegularRoute(module: () => Promise<Module>, key: string) {
  const Element = lazy(module);
  const ErrorElement = lazy(() =>
    module().then((mod) => ({ default: mod.ErrorElement || null })),
  );
  const index = /(?<!pages\/)index\.(jsx|tsx)$/.test(key)
    ? { index: true }
    : {};

  return {
    ...index,
    element: <Suspense fallback={null} children={<Element />} />,
    loader: async (...args: [LoaderFunctionArgs]) =>
      module().then((mod) => mod?.loader?.(...args) || null),
    action: async (...args: [ActionFunctionArgs]) =>
      module().then((mod) => mod?.action?.(...args) || null),
    handle: {
      breadcrumb: module().then((mod) => {
        return mod?.breadcrumb;
      }),
    },
    errorElement: <Suspense fallback={null} children={<ErrorElement />} />,
  };
}

export function createAppRouter() {
  const preservedRoutesBlob = import.meta.glob<Module>(
    '/pages/(_app|404).tsx',
    { eager: true },
  );
  const regularRoutesBlob = import.meta.glob<Module>([
    '/pages/**/[\\w[]*.tsx',
    '!**/(_app|404).*',
  ]);

  // const preservedRoutes = Object.keys(preservedRoutesBlob).reduce(
  //   (routes, key) => {
  //     const path = key.replace(...patterns.route);
  //     return {
  //       ...routes,
  //       [path]: {
  //         element: preservedRoutesBlob[key]?.default,
  //         breadcrumb: preservedRoutesBlob[key]?.breadcrumb,
  //       },
  //     };
  //   },
  //   {},
  // );

  const preservedRoutes = generatePreservedRoutes<Element>(preservedRoutesBlob);
  const regularRoutes = generateRegularRoutes<
    RouteObject,
    () => Promise<Module>
  >(regularRoutesBlob, buildRegularRoute);

  const appIndex = '_app';
  const App = preservedRoutes?.[appIndex] || Fragment;
  const NotFound = preservedRoutes?.['404'] || Fragment;

  const appBlobKey = '/pages/_app.tsx';
  const appBlob = import.meta.glob<Module>('/pages/_app.tsx', { eager: true });

  const routes = [...regularRoutes, { path: '*', element: <NotFound /> }];
  return createHashRouter([
    {
      element: (
        <App
          children={
            <>
              <OvhContainerRoutingSync />
              <Outlet />
            </>
          }
        />
      ),
      ...(appBlob[appBlobKey].breadcrumb
        ? {
            handle: {
              breadcrumb: appBlob[appBlobKey].breadcrumb,
            },
          }
        : {}),
      children: routes,
    },
  ]);
}

export default OvhContainerRoutingSync;
