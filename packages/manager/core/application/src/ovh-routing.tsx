import React, {
  lazy,
  useEffect,
  Fragment,
  Suspense,
  useLayoutEffect,
} from 'react';
import {
  useLocation,
  RouteObject,
  createHashRouter,
  Outlet,
  LoaderFunction,
  ActionFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
  useRouteError,
  useOutlet,
  useNavigate,
} from 'react-router-dom';
import {
  generateRegularRoutes,
  generatePreservedRoutes,
} from 'generouted/core';
import OvhTracking from './ovh-tracking';

import { useShell } from '.';

type Element = () => JSX.Element;
type Module = {
  default: Element;
  loader: LoaderFunction;
  action: ActionFunction;
  ErrorElement: Element;
  breadcrumb: () => unknown;
};

function HidePreloader(): JSX.Element {
  const shell = useShell();
  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);
  return undefined;
}

function OvhContainerRoutingSync(): JSX.Element {
  const location = useLocation();
  const outlet = useOutlet();
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      const child = outlet.props?.children?.props?.children?.props?.children;
      if (child === null || child === undefined) {
        navigate('/');
      }
    }, 500);
  }, [outlet]);

  const shell = useShell();
  useEffect(() => {
    shell.routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    shell.routing.onHashChange();
  }, [location]);
  return undefined;
}

function DefaultErrorHandler() {
  const error = useRouteError();
  if (import.meta.env.DEV) {
    throw error;
  }
  return null;
}

function buildRegularRoute(module: () => Promise<Module>, key: string) {
  const Element = lazy(module);
  const ErrorElement = lazy(() =>
    module().then((mod) => ({
      default: mod.ErrorElement || DefaultErrorHandler,
    })),
  );
  let index = {};

  if (/index\.(jsx|tsx)$/.test(key) && !/pages\/index/.test(key)) {
    index = { index: true };
  }

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

  const newRoutes = regularRoutes.map((route, index) => {
    if (route.path === 'dashboard') {
      return {
        ...route,
        path: '*',
        errorElement: <NotFound />,
        error: <NotFound />,
      };
    }
    return route;
  });

  const routes = [...newRoutes, { path: '*', element: <NotFound /> }];
  return createHashRouter([
    {
      element: (
        <App
          children={
            <>
              <OvhContainerRoutingSync />
              <HidePreloader />
              <Outlet />
              <OvhTracking />
            </>
          }
        />
      ),
      ...(appBlob[appBlobKey]?.breadcrumb
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
