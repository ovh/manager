import { lazy } from 'react';
import { Navigate, Route } from 'react-router-dom';
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

// Settings
const SettingsListingPage = lazy(() => import('@/pages/settings/listing'));

const SettingsDashboardPage = lazy(() => import('@/pages/settings/dashboard'));

const SettingsGeneralInformationsPage = lazy(() =>
  import('@/pages/settings/generalInformations').then((m) => ({
    default: m.SettingsGeneralInformationsPage,
  })),
);

const EditNameModal = lazy(() =>
  import('@/pages/settings/generalInformations').then((m) => ({
    default: m.EditNameModal,
  })),
);

const SettingsGrafanaPage = lazy(() => import('@/pages/settings/grafana'));
const SettingsPolitiqueIAMPage = lazy(() =>
  import('@/pages/settings/politicsIAM'),
);
const SettingsInfrastructurePage = lazy(() =>
  import('@/pages/settings/infrastructure'),
);

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

    <Route path="/settings" Component={SettingsListingPage} />

    <Route path="/settings/:serviceId" Component={SettingsDashboardPage}>
      <Route
        path="general-informations"
        Component={SettingsGeneralInformationsPage}
      >
        <Route path="edit-name" Component={EditNameModal} />
      </Route>

      <Route path="grafana" Component={SettingsGrafanaPage} />

      <Route path="politiqueIAM" Component={SettingsPolitiqueIAMPage} />

      <Route path="infrastructure" Component={SettingsInfrastructurePage} />
    </Route>
  </Route>
);
