import React, { useEffect, Fragment } from 'react';
import {
  useLocation,
  RouteObject,
  createHashRouter,
  Outlet,
} from 'react-router-dom';
import {
  generatePreservedRoutes,
  generateRegularRoutes,
} from 'generouted/src/core';
import { Module, Element, buildRegularRoute } from 'generouted/react-router';

import { useShell } from '.';

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
