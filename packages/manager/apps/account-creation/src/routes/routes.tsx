import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';

const LayoutPage = lazy(() => import('@/pages/layout'));
const SettingsPage = lazy(() => import('@/pages/settings/settings.page'));
const AccountTypePage = lazy(() =>
  import('@/pages/accountType/AccountType.page'),
);
const AccountDetailsPage = lazy(() =>
  import('@/pages/accountDetails/accountDetails.page'),
);
const CompanyPage = lazy(() => import('@/pages/company/Company.page'));

export default (
  <Route
    path={urls.root}
    Component={LayoutPage}
    errorElement={
      <ErrorBoundary
        isPreloaderHide
        isRouteShellSync
        redirectionApp="account-creation"
      />
    }
  >
    <Route
      path={urls.settings}
      Component={SettingsPage}
      handle={{
        tracking: {
          pageName: 'choose-preferences',
        },
      }}
    />
    <Route
      path={urls.accountType}
      Component={AccountTypePage}
      handle={{
        tracking: {
          pageName: 'select-account-type'
        },
      }}
    />
    <Route
      path={urls.company}
      Component={CompanyPage}
      handle={{
        tracking: {
          pageName: 'add-customer-informations',
        },
      }}
    />
    <Route
      path={urls.accountDetails}
      Component={AccountDetailsPage}
      handle={{
        tracking: {
          pageName: 'check-customer-informations',
        },
      }}
    />
  </Route>
);
