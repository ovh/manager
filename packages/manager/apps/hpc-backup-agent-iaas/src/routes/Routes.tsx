import React from 'react';

import { Navigate, Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import { appName } from '@/App.constants';
import NotFound from '@/pages/not-found/404.page';

import { subRoutes, urls } from './Routes.constants';

const MainLayoutPage = React.lazy(() => import('@/pages/Main.layout'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const ListingPage = React.lazy(() => import('@/pages/listing/Listing.page'));
const DeleteTenantPage = React.lazy(() => import('@/pages/listing/delete/DeleteTenant.page'));

export default (
  <>
    <Route path="/" element={<Navigate to={urls.root} replace />} />
    <Route
      id="root"
      path={urls.root}
      Component={MainLayoutPage}
      errorElement={
        <ErrorBoundary isPreloaderHide={true} isRouteShellSync={true} redirectionApp={appName} />
      }
    >
      <Route
        path={subRoutes.onboarding}
        Component={OnboardingPage}
        handle={{
          tracking: { pageName: 'onboarding', pageType: PageType.onboarding },
        }}
      />
      <Route
        path={urls.listing}
        Component={ListingPage}
        handle={{
          tracking: { pageName: 'listing', pageType: PageType.listing },
        }}
      >
        <Route
          path={subRoutes.delete}
          Component={DeleteTenantPage}
          handle={{
            tracking: { pageName: 'deleteVSPC', pageType: PageType.popup },
          }}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
