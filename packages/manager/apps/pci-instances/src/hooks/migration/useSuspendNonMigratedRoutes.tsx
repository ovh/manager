import { ComponentType } from 'react';
import { ShellContextType } from '@ovh-ux/manager-react-shell-client';
import { LoaderFunction, matchPath, useLoaderData } from 'react-router-dom';

export const suspendNonMigratedRoutesLoader = (
  shell: ShellContextType,
  loaderCallback?: LoaderFunction,
): LoaderFunction => {
  const routes =
    shell.environment.applications['pci-instances']?.container.hashes;

  return (loaderParams, ...restArgs) => {
    const { pathname } = new URL(loaderParams.request.url);
    const isRouteAvailable =
      !routes || routes.some((r) => matchPath(r, pathname) !== null);

    // We send an object to trigger the redirection and handle it inside the `WithSuspendedMigratedRoutes` HOC
    if (!isRouteAvailable) return { routeMigrated: false };

    return loaderCallback?.(loaderParams, ...restArgs) ?? null;
  };
};

export const withSuspendedMigrateRoutes = (
  Component: ComponentType<Record<string, never>>,
): {
  (): JSX.Element;
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
    return <Component />;
  }

  WithSuspendedMigratedRoutes.displayName = `withSuspendedMigratedRoutesHoC(${Component.displayName ??
    Component.name})`;

  return WithSuspendedMigratedRoutes;
};
