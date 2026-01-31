import React from 'react';

import { Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/not-found/Error404.page';
import PublicIpRouting from '@/pages/public-ip-routing/PublicIpRouting.page';

import { redirectionApp, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/Dashboard.page'));

export default (
  <>
    <Route
      id="root"
      path="/"
      Component={MainLayoutPage}
      errorElement={
        <ErrorBoundary
          isPreloaderHide={true}
          isRouteShellSync={true}
          redirectionApp={redirectionApp}
        />
      }
    >
      <Route id="vrack.dashboard" path={urls.dashboard} Component={DashboardPage}>
        <Route
          id="vrack.dashboard.publicIpRouting"
          path={urls.dashboard}
          Component={PublicIpRouting}
          handle={{
            tracking: {
              pageName: 'public-ip-routing',
              pageType: PageType.dashboard,
            },
          }}
        />
      </Route>
      <Route
        id="onboarding"
        path={urls.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
        }}
      />
    </Route>
    <Route path="*" element={<NotFound />} />
  </>
);
