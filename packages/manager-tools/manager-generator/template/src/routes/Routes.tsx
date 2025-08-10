import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';

import NotFound from '@/pages/not-found/404.page';
import { redirectionApp, subRoutes, urls } from '@/routes/Routes.utils';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/Dashboard.page'));
const DashboardOverviewPage = React.lazy(() => import('@/pages/dashboard/listing/Listing.page'));
const DashboardSettingsPage = React.lazy(() => import('@/pages/dashboard/settings/Settings.page'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));

/**
 * Application route tree.
 *
 * Responsibilities:
 * - Defines the **core routing structure** of the application.
 * - Redirects container entry (`/`) → `urls.root` (flavor-aware root).
 * - Mounts the root layout (`MainLayoutPage`) under `urls.root`.
 * - Configures nested routes for Onboarding, Dashboard (overview + settings),
 *   and a 404 fallback page.
 *
 * Features:
 * - Uses **React.lazy** for lazy-loaded pages, reducing initial bundle size.
 * - Provides a default redirect from `/root` → `/dashboard`.
 * - Integrates `ErrorBoundary` with Manager shell to handle:
 *   - Preloader lifecycle
 *   - Redirections (via `redirectionApp`)
 *   - Route-shell synchronization
 *
 * Routing conventions:
 * - `urls.*` constants define the top-level paths (root, dashboard, onboarding).
 * - `subRoutes.*` constants define nested segments (e.g., `settings` tab).
 *
 * @example
 * ```tsx
 * import { BrowserRouter, Routes } from 'react-router-dom';
 * import routes from '@/routes/App.routes';
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <Routes>{routes}</Routes>
 *     </BrowserRouter>
 *   );
 * }
 * ```
 */
export default (
  <>
    {/* Redirect container "/" → flavor-specific root (e.g. /pci/projects/:projectId/appSlug) */}
    <Route path="/" element={<Navigate to={urls.root} replace />} />

    {/* Rooted application layout */}
    <Route
      id="root"
      path={urls.root}
      Component={MainLayoutPage}
      errorElement={
        <ErrorBoundary
          isPreloaderHide={true}
          isRouteShellSync={true}
          redirectionApp={redirectionApp}
        />
      }
    >
      {/* Default landing inside root → redirect to dashboard */}
      <Route index element={<Navigate to="dashboard" replace />} />

      {/* Onboarding route */}
      <Route path={urls.onboarding} Component={OnboardingPage} />

      {/* Dashboard with nested tabs */}
      <Route path={urls.dashboard} Component={DashboardPage}>
        {/* Default dashboard view → overview */}
        <Route index Component={DashboardOverviewPage} />
        {/* Settings tab */}
        <Route path={subRoutes.settings} Component={DashboardSettingsPage} />
      </Route>

      {/* Catch-all 404 route inside the app */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
