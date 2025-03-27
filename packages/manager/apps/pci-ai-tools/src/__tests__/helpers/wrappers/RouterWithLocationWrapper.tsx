import React from 'react';
import {
  RouterProvider,
  createHashRouter,
  MemoryRouter,
  useLocation,
} from 'react-router-dom';
import * as useLoadingIndicator from '@/contexts/LoadingIndicator.context';

/**
 * Displays the current location in order to test the syncing between the state of the hook and the url
 */
export const LocationDisplay = () => {
  const location = useLocation();
  return (
    <div data-testid="location-display">{`${location.pathname}${location.search}`}</div>
  );
};

export const RouterWithLocationWrapper = ({
  children,
  initialEntries = ['/test'],
}: {
  children: React.ReactNode;
  initialEntries: string[];
}) => {
  return (
    <MemoryRouter initialEntries={initialEntries}>
      {children}
      <LocationDisplay />
    </MemoryRouter>
  );
};

export const HashRouterWithLocationWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const element = (
    <>
      {children}
      <LocationDisplay />
    </>
  );
  const router = createHashRouter([
    {
      path: '/',
      element,
    },
  ]);
  return (
    <useLoadingIndicator.LoadingIndicatorProvider>
      <RouterProvider router={router} />
    </useLoadingIndicator.LoadingIndicatorProvider>
  );
};
