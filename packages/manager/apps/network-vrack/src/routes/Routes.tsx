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
const DeleteVrackIpv4 = React.lazy(
  () => import('@/pages/public-ip-routing/actions/delete-vrack-ipv4/DeleteVrackIpv4.page'),
);
const DeleteVrackIpv6Subrange = React.lazy(
  () =>
    import(
      '@/pages/public-ip-routing/actions/delete-vrack-ipv6-subrange/DeleteVrackIpv6Subrange.page'
    ),
);

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
            currentPage: 'vrack.dashboard.publicIpRouting',
          }}
        >
          <Route
            id="vrack.dashboard.detachIpv4"
            path={urls.detachIpv4}
            Component={DeleteVrackIpv4}
            handle={{
              tracking: {
                pageName: 'detach-ipv4',
                pageType: PageType.popup,
              },
              currentPage: 'vrack.dashboard.detachIpv4',
            }}
          />
          <Route
            id="vrack.dashboard.detachIpv6Subrange"
            path={urls.detachIpv6Subrange}
            Component={DeleteVrackIpv6Subrange}
            handle={{
              tracking: {
                pageName: 'detach-ipv6-subrange',
                pageType: PageType.popup,
              },
              currentPage: 'vrack.dashboard.detachIpv6Subrange',
            }}
          />
        </Route>
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
