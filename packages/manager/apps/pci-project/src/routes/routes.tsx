import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';

const LayoutPage = lazy(() => import('@/pages/Layout'));
const MainPage = lazy(() => import('@/pages/main/Main.page'));
const DashboardPage = lazy(() =>
  import('@/pages/main/dashboard/Dashboard.page'),
);
const SettingsPage = lazy(() => import('@/pages/main/settings/Settings.page'));
const OnboardingPage = lazy(() => import('@/pages/onboarding'));

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="project"
      />
    }
  >
    <Route path=":resourceName" Component={MainPage}>
      <Route
        index
        Component={DashboardPage}
        handle={{
          tracking: {
            pageName: 'dashboard',
            pageType: PageType.dashboard,
          },
        }}
      />
      <Route
        path={urls.settings}
        Component={SettingsPage}
        handle={{
          tracking: {
            pageName: 'settings',
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
