import React, { lazy } from 'react';
import { Route } from 'react-router-dom';
import { urls } from './routes.constant';
import { ErrorBoundary } from '@ovh-ux/muk';
import { PageType } from '@ovh-ux/manager-react-shell-client';

const LayoutPage = lazy(() => import('@/pages/listing'));
const ServerListing = lazy(() => import('@/pages/listing/server'));
const ClusterListing = lazy(() => import('@/pages/listing/cluster'));
const OnboardingPage = lazy(() => import('@/pages/onboarding'));

export default (
  <>
    <Route
      id="root"
      path={urls.root}
      Component={LayoutPage}
      errorElement={<ErrorBoundary redirectionApp="dedicated-servers" />}
    >
      <Route
        id="server-listing"
        path={urls.server}
        Component={ServerListing}
        handle={{
          tracking: { pageName: 'all-servers', pageType: PageType.listing },
        }}
      />
      <Route
        id="cluster-listing"
        path={urls.cluster}
        Component={ClusterListing}
        handle={{
          tracking: { pageName: 'cluster', pageType: PageType.listing },
        }}
      />
    </Route>
    <Route
      id="onboarding"
      path={urls.onboarding}
      Component={OnboardingPage}
      errorElement={<ErrorBoundary redirectionApp="dedicated-servers" />}
    />
  </>
);
