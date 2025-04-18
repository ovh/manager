import { getLogsRoute } from '@ovh-ux/logs-to-customer';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { urls } from '@/routes/routes.constant';

const LayoutPage = lazy(() => import('@/pages/layout'));
const ListingPage = lazy(() => import('@/pages/listing'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const GeneralInfosPage = lazy(() =>
  import('@/pages/dashboard/general-informations'),
);
const LogsPage = lazy(() => import('@/pages/dashboard/logs/Logs.page'));
const OnboardingPage = lazy(() => import('@/pages/onboarding'));

export default (
  <Route
    path={urls.root}
    id="root"
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="hpc-vmware-vsphere"
      />
    }
  >
    <Route
      index
      Component={ListingPage}
      id="listing"
      handle={{
        tracking: {
          pageName: 'listing',
          pageType: PageType.listing,
        },
      }}
    />
    <Route path={urls.dashboard} Component={DashboardPage} id="dashboard">
      <Route
        index
        id="general-info"
        Component={GeneralInfosPage}
        handle={{
          tracking: {
            pageName: 'dashboard',
            pageType: PageType.dashboard,
          },
        }}
      />
      <Route
        path={urls.logs}
        id="logs"
        Component={LogsPage}
        handle={{
          tracking: {
            pageName: 'logs',
            pageType: PageType.dashboard,
          },
        }}
      >
        {getLogsRoute()}
      </Route>
    </Route>
    <Route
      path={urls.onboarding}
      id="onboarding"
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageName: 'onboarding',
          pageType: PageType.onboarding,
        },
      }}
    />
  </Route>
);
