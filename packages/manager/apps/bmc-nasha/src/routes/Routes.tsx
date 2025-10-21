import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));

const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/Dashboard.page'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const LandingRedirect = React.lazy(() => import('@/components/LandingRedirect/LandingRedirect'));

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
      {/* Default landing inside root → smart redirect based on services */}
      <Route index Component={LandingRedirect} />

      {/* Onboarding route */}
      <Route
        path={urls.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Listing route */}
      <Route
        path={urls.listing}
        Component={ListingPage}
        handle={{
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Dashboard route */}
      <Route
        path={urls.dashboard}
        Component={DashboardPage}
        handle={{
          tracking: {
            pageName: 'dashboard',
            pageType: PageType.listing,
          },
        }}
      />

      {/* Catch-all 404 route inside the app */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
