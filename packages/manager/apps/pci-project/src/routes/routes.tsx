import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';

const LayoutPage = lazy(() => import('@/pages/layout'));
const ListingPage = lazy(() => import('@/pages/listing/Listing'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
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
      path={urls.listing}
      Component={ListingPage}
      handle={{
        tracking: {
          pageName: 'listing',
          pageType: PageType.listing,
        },
      }}
    />
    <Route path={urls.dashboard} Component={DashboardPage}>
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
        path={urls.tab2}
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
