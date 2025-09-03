import { ComponentType, useCallback, useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { matchPath, useLocation } from 'react-router-dom';
import { useSuspenseQuery } from '@tanstack/react-query';

const getPromise = () => {
  // We need to have 42 because tanstack query needs data to be returned
  // 1000 is an arbitrary time, we just need to wait for the container to accept the hash change and do its thing
  return new Promise((resolve) => setTimeout(resolve, 1000, 42));
};

export function useSuspendNonMigrateRoutes() {
  const { environment } = useContext(ShellContext);
  const location = useLocation();

  const routes = environment?.applications['pci-instances']?.container.hashes;

  const queryFn = useCallback(() => {
    const isRouteAvailable =
      !routes || routes.some((r) => matchPath(r, location.pathname) !== null);

    // We need to have 42 because tanstack query needs data to be returned
    return !isRouteAvailable ? getPromise() : Promise.resolve(42);
  }, [routes, location.pathname]);

  return useSuspenseQuery({
    // Here we use the window one to have the latest hash value
    queryKey: ['suspense-promise-to-allow-rerender', window.location.hash],
    queryFn,
  });
}

export const withSuspendedMigrateRoutes = (
  Component: ComponentType<Record<string, never>>,
): {
  (): JSX.Element;
  displayName: string;
} => {
  function WithSuspendedMigratedRoutes() {
    useSuspendNonMigrateRoutes();

    return <Component />;
  }

  WithSuspendedMigratedRoutes.displayName = `withSuspendedMigratedRoutesHoC(${Component.displayName ??
    Component.name})`;

  return WithSuspendedMigratedRoutes;
};
