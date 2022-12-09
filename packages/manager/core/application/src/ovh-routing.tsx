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
  generatePreservedRoutes,
  generateRegularRoutes,
} from 'generouted/core';

import { useShell } from '.';

type Element = () => JSX.Element;
type Module = {
  default: Element;
  loader: LoaderFunction;
  action: ActionFunction;
  ErrorElement: Element;
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
    module().then((module) => ({ default: module.ErrorElement || null })),
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
    errorElement: <Suspense fallback={null} children={<ErrorElement />} />,
  };
}

export function createAppRouter() {
  const preservedRoutesBlob = import.meta.glob<Module>(
    '/pages/(_app|404).{jsx,tsx}',
    { eager: true },
  );
  const regularRoutesBlob = import.meta.glob<Module>([
    '/pages/**/[\\w[]*.{jsx,tsx}',
    '!**/(_app|404).*',
  ]);

  const preservedRoutes = generatePreservedRoutes<Element>(preservedRoutesBlob);
  const regularRoutes = generateRegularRoutes<
    RouteObject,
    () => Promise<Module>
  >(regularRoutesBlob, buildRegularRoute);

  const appIndex = '_app';
  const App = preservedRoutes?.[appIndex] || Fragment;
  const NotFound = preservedRoutes?.['404'] || Fragment;

  const routes = [...regularRoutes, { path: '*', element: <NotFound /> }];
  const router = createHashRouter([
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
      children: routes,
    },
  ]);

  return router;
}

export default OvhContainerRoutingSync;
