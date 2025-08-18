import { Suspense, useContext, useEffect } from 'react';

import { Outlet, useLocation, useMatches } from 'react-router-dom';

import { ShellContext, useOvhTracking, useRouteSynchro } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

import { appName } from '@/App.constants';

/**
 * Main application layout wrapper.
 *
 * This component:
 * 1. Synchronizes the app's routing state with the OVH Manager shell via {@link useRouteSynchro}.
 * 2. Defines the current page ID for request correlation using {@link defineCurrentPage}.
 * 3. Tracks page views through {@link useOvhTracking} whenever the route changes.
 * 4. Hides the OVH Manager shell preloader after the app mounts.
 * 5. Wraps child routes with React's {@link Suspense} for lazy loading.
 *
 * @remarks
 * - The `matches` array from {@link useMatches} is used to determine the deepest matched route
 *   so that the page ID includes the most specific route identifier.
 * - The `appName` constant is combined with the route ID to form the tracking/page tag.
 * - The component does not render any visual layout itself; it acts as a wrapper for nested routes.
 *
 * @example
 * ```tsx
 * import { createBrowserRouter, RouterProvider } from 'react-router-dom';
 *
 * const router = createBrowserRouter([
 *   {
 *     element: <MainLayout />,
 *     children: [
 *       { path: '/', element: <HomePage /> },
 *       { path: '/about', element: <AboutPage /> },
 *     ],
 *   },
 * ]);
 *
 * export function App() {
 *   return <RouterProvider router={router} />;
 * }
 * ```
 */
export default function MainLayout() {
  const location = useLocation();
  const matches = useMatches();
  const { shell } = useContext(ShellContext);
  const { trackCurrentPage } = useOvhTracking();

  // Keep shell route state in sync with React Router
  useRouteSynchro();

  // Tag the current page for request correlation
  useEffect(() => {
    const lastMatch = matches.at(-1); // most specific route
    if (lastMatch?.id) {
      defineCurrentPage(`app.${appName}-${lastMatch.id}`);
    }
  }, [matches]);

  // Track page views on route change
  useEffect(() => {
    trackCurrentPage();
  }, [trackCurrentPage, location.pathname]);

  // Hide shell preloader on mount
  useEffect(() => {
    void shell.ux.hidePreloader();
  }, [shell]);

  return (
    <Suspense fallback={null /* Replace with loader if desired */}>
      <Outlet />
    </Suspense>
  );
}
