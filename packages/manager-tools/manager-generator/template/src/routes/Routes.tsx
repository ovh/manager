import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, subRoutes, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));

const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));

const DashboardPage = React.lazy(() => import('@/pages/dashboard/Dashboard.page'));
const GeneralInformationPage = React.lazy(
  () => import('@/pages/dashboard/general-information/GeneralInformation.page'),
);
const HelpPage = React.lazy(() => import('@/pages/dashboard/help/Help.page'));

const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));

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
      {/* Default landing inside root → redirect to listing */}
      <Route index element={<Navigate to="listing" replace />} />

      {/* Dashboard with nested tabs */}
      <Route path={urls.dashboard} Component={DashboardPage}>
        {/* Default dashboard view → overview */}
        <Route index Component={GeneralInformationPage} />
        {/* Help tab */}
        <Route path={subRoutes.help} Component={HelpPage} />
      </Route>

      {/* Listing route */}
      <Route path={urls.listing} Component={ListingPage} />

      {/* Onboarding route */}
      <Route path={urls.onboarding} Component={OnboardingPage} />

      {/* Catch-all 404 route inside the app */}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
