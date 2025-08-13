import React, { Suspense, useContext, useEffect } from 'react';

import { RouterProvider, createHashRouter, createRoutesFromElements } from 'react-router-dom';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import Routes from '@/routes/Routes';

import queryClient from './QueryClient';

/**
 * Root application component.
 *
 * This component wires together:
 * - React Router with hash-based navigation (via `createHashRouter`)
 * - TanStack Query for data fetching and caching
 * - Shell context for integration with OVHcloud Manager (e.g., preloader)
 * - React Suspense for lazy-loaded route components
 * - React Query DevTools for debugging API requests in development
 *
 * @remarks
 * - The router configuration is built from the static `Routes` definition.
 * - The `ShellContext` is used to hide the preloader after app initialization.
 * - Uses hash-based routing to support environments without server-side routing.
 */
function App() {
  const { shell } = useContext(ShellContext);

  // Build the router from static route definitions
  const router = createHashRouter(createRoutesFromElements(Routes));

  /**
   * Hide the OVHcloud Manager shell preloader once the app is mounted.
   *
   * This ensures that the initial loading screen is dismissed after
   * the first render, even if routes are still lazy-loading.
   */
  useEffect(() => {
    const hidePreloader = async () => {
      try {
        await shell?.ux?.hidePreloader?.();
      } catch (err) {
        console.error('Failed to hide preloader:', err);
      }
    };

    void hidePreloader();
  }, [shell]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Suspense ensures lazy-loaded route components show a fallback UI */}
      <Suspense fallback={<span>Loading routes ...</span>}>
        <RouterProvider router={router} />
      </Suspense>

      {/* React Query Devtools are included for development and debugging */}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
