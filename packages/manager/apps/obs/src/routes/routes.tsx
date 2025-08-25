import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { getObservabilityRoute } from '@ovh-ux/observability';
import { OBS_URL_PARAMS, urls } from '@/routes/routes.constant';
import appConfig from '@/obs.config';

const { ObsEnabledFeatures, defaultFeature } = appConfig;

const LayoutPage = lazy(() => import('@/pages/layout'));

// Overview
const OverviewPage = lazy(() => import('@/pages/overview'));

// Dashboards
const DashboardsListingPage = lazy(() => import('@/pages/dashboards/listing'));
const DashobardDetailsPage = lazy(() => import('@/pages/dashboards/details'));

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="obs"
      />
    }
  >
    <Route
      path={urls.root}
      Component={OverviewPage}
      handle={{
        tracking: {
          pageName: '',
          pageType: PageType.onboarding,
        },
      }}
    />

    <Route
      path={urls.dashboards}
      Component={DashboardsListingPage}
      handle={{
        tracking: {
          pageName: 'dashboards',
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      path={`${urls.dashboards}/${OBS_URL_PARAMS.productId}`}
      element={
        <DashobardDetailsPage
          enabledFeatures={ObsEnabledFeatures}
          defaultActiveFeature={defaultFeature}
        />
      }
      handle={{
        tracking: {
          pageName: 'dahboardDetails',
        },
      }}
    >
      {getObservabilityRoute(ObsEnabledFeatures, defaultFeature)}
    </Route>
  </Route>
);
