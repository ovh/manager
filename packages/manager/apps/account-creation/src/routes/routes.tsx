import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';

const LayoutPage = lazy(() => import('@/pages/layout'));
const PreferencesPage = lazy(() =>
  import('@/pages/preferences/preferences.page'),
);
const AccountTypePage = lazy(() =>
  import('@/pages/accountType/AccountType.page'),
);
const AccountDetailsPage = lazy(() =>
  import('@/pages/accountDetails/accountDetails.page'),
);

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide={true}
        isRouteShellSync={true}
        redirectionApp="account-creation"
      />
    }
  >
    <Route
      path={urls.preferences}
      Component={PreferencesPage}
      handle={{
        tracking: {
          pageName: 'preferences',
          pageType: PageType.funnel,
        },
      }}
    />
    <Route
      path={urls.accountType}
      Component={AccountTypePage}
      handle={{
        tracking: {
          pageName: 'account-type',
          pageType: PageType.funnel,
        },
      }}
    />
    <Route
      path={urls.accountDetails}
      Component={AccountDetailsPage}
      handle={{
        tracking: {
          pageName: 'account-details',
          pageType: PageType.funnel,
        },
      }}
    />
  </Route>
);
