import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { APP_URL } from '@/routes/routes.constant';

const LayoutPage = lazy(() => import('@/pages/Layout'));
const ListingPage = lazy(() => import('@/pages/listing/Listing'));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const GeneralInfosPage = lazy(() =>
  import('@/pages/dashboard/general-informations'),
);
const Tab2Page = lazy(() => import('@/pages/dashboard/tab2'));
const OnboardingPage = lazy(() => import('@/pages/onboarding'));

export default (
  <Route
    path="/pci/projects"
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="project"
      />
    }
  >
    <Route
      path={APP_URL.dashboard}
      Component={DashboardPage}
      handle={{
        tracking: {
          pageName: 'index',
          pageType: PageType.listing,
        },
      }}
    />
    <Route
      path={APP_URL.listing}
      Component={ListingPage}
      handle={{
        tracking: {
          pageName: 'listing',
          pageType: PageType.listing,
        },
      }}
    />
    <Route path={APP_URL.dashboard} Component={DashboardPage}>
      <Route
        path=""
        Component={GeneralInfosPage}
        handle={{
          tracking: {
            pageName: 'dashboard',
            pageType: PageType.dashboard,
          },
        }}
      />
      <Route
        path={APP_URL.tab2}
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
      path={APP_URL.onboarding}
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
