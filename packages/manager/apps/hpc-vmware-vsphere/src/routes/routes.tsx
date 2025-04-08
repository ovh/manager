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
const Tab2Page = lazy(() => import('@/pages/dashboard/tab2'));
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
      path={urls.listing}
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
        path=""
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
        path={urls.tab2}
        id="tab2"
        Component={Tab2Page}
        handle={{
          tracking: {
            pageName: 'tab2',
            pageType: PageType.dashboard,
          },
        }}
      />
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
