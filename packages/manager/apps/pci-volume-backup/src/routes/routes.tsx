import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';

const LayoutPage = lazy(() => import('@/pages/layout'));
const ListingPage = lazy(() => import('@/pages/listing'));
const OnboardingPage = lazy(() => import('@/pages/onboarding'));
const CreateVolumePage = lazy(() =>
  import('@/pages/create-volume/CreateVolume.page'),
);

export default (
  <Route
    path="/pci/projects/:projectId/storages/volume-backup"
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="volume-backup"
      />
    }
  >
    <Route path="" element={<Navigate to={urls.listing} replace />} />
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
    <Route
      path={urls.onboarding}
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageName: 'onboarding',
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route
      path={urls.createVolume}
      Component={CreateVolumePage}
      handle={{
        tracking: {
          pageName: 'create-volume',
        },
      }}
    />
  </Route>
);
