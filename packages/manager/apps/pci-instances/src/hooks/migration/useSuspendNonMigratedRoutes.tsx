import { ComponentType, ReactNode } from 'react';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { LoaderFunction, matchPath, useLoaderData } from 'react-router-dom';

const DASHBOARD_HASH = '/pci/projects/:projectId/instances/:instanceId';

export const suspendNonMigratedRoutesLoader = (
  shell: ShellContextType,
  loaderCallback?: LoaderFunction,
): LoaderFunction => {
  const containerHashes =
    shell.environment.applications['pci-instances']?.container.hashes;

  const routes = new Set(containerHashes);

  const hasAccessToDashboard = Array.from(routes).some((hash) =>
    hash.includes(':instanceId'),
  );
  const dashboardHashAlreadyExists = Array.from(routes).find(
    (elt) => elt === DASHBOARD_HASH,
  );

  return (loaderParams, ...restArgs) => {
    const { pathname } = new URL(loaderParams.request.url);

    if (!pathname.endsWith('/new') && !dashboardHashAlreadyExists) {
      if (hasAccessToDashboard) routes.add(DASHBOARD_HASH);
    }

    const isRouteAvailable =
      !routes.size ||
      Array.from(routes).some((r) => matchPath(r, pathname) !== null);

    // We send an object to trigger the redirection and handle it inside the `WithSuspendedMigratedRoutes` HOC
    if (!isRouteAvailable) return { routeMigrated: false };

    return loaderCallback?.(loaderParams, ...restArgs) ?? null;
  };
};

export const withSuspendedMigrateRoutes = (
  Component?: ComponentType<Record<string, never>>,
): {
  (): ReactNode;
  displayName: string;
} => {
  function WithSuspendedMigratedRoutes() {
    const loaderData = useLoaderData();

    const needsSuspense =
      typeof loaderData === 'object' &&
      loaderData !== null &&
      'routeMigrated' in loaderData &&
      loaderData.routeMigrated === false;

    // If we need to move to angular app we suspend with a 1s promise to let the container receive the event and display a loader
    if (needsSuspense)
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw new Promise((resolve) => setTimeout(resolve, 1000, 42));
    return !!Component && <Component />;
  }

  WithSuspendedMigratedRoutes.displayName = Component
    ? `withSuspendedMigratedRoutesHoC(${Component.displayName ??
        Component.name})`
    : 'withSuspendedMigratedRoutesHoC';

  return WithSuspendedMigratedRoutes;
};
