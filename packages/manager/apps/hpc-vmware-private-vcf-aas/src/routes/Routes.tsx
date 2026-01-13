import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/not-found/404.page';

import { redirectionApp, subRoutes, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
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
      <Route index Component={ListingPage} />
      <Route
        path={subRoutes.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
        }}
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
