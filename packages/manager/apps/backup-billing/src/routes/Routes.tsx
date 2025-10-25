import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

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
    <Route path="/" element={<Navigate to={urls.root} replace />} />
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
      <Route
        index
        Component={ListingPage}
        handle={{
          tracking: { pageName: 'listing', pageType: PageType.listing },
        }}
      />
      <Route
        path={subRoutes.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
        }}
      />
      <Route path={subRoutes.dashboard} Component={DashboardPage}>
        <Route
          index
          Component={GeneralInformationPage}
          handle={{
            tracking: { pageName: 'dashboard', pageType: PageType.dashboard },
          }}
        />
        <Route
          path={subRoutes.help}
          Component={HelpPage}
          handle={{
            tracking: { pageName: 'help', pageType: PageType.dashboard },
          }}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
