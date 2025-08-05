import React from 'react';
import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { Route } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';
import {
  EDIT_ACCOUNT,
  EDIT_PASSWORD,
  GENERAL_INFORMATION,
  LICENCES,
  USAGE,
  DELETE_ACCOUNT,
  ORDER_ACCOUNT,
} from '@/tracking.constants';

const LayoutPage = React.lazy(() => import('@/pages/layout'));
const LicensesPage = React.lazy(() => import('@/pages/licenses/licenses.page'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard'));
const GeneralInformationPage = React.lazy(() =>
  import('@/pages/dashboard/generalInformation/GeneralInformation.page'),
);
const EditNamePage = React.lazy(() =>
  import(
    '@/pages/dashboard/generalInformation/updateDisplayName/UpdateDisplayName.modal'
  ),
);
const UsersPage = React.lazy(() =>
  import('@/pages/dashboard/users/Users.page'),
);
const UsersDeletePage = React.lazy(() =>
  import('@/pages/dashboard/users/deleteUsers/DeleteUsers.modal'),
);
const UsersEditPage = React.lazy(() =>
  import('@/pages/dashboard/users/editUsers/EditUsers.modal'),
);
const UsersChangePasswordPage = React.lazy(() =>
  import(
    '@/pages/dashboard/users/changePasswordUsers/ChangePasswordUsers.modal'
  ),
);
const UsersOrderLicensesPage = React.lazy(() =>
  import('@/pages/dashboard/users/orderLicenses/OrderLicenses.modal'),
);
const UsersOrderUsersPage = React.lazy(() =>
  import('@/pages/dashboard/users/orderUsers/OrderUsers.modal'),
);
const ConsumptionPage = React.lazy(() =>
  import('@/pages/dashboard/consumption/Consumption.page'),
);
const OnboardingPage = React.lazy(() => import('@/pages/onboarding'));

export default (
  <Route
    path={''}
    Component={LayoutPage}
    id={'root'}
    errorElement={
      <ErrorBoundary
        redirectionApp="web-office-backup"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route
      path={urls.listing}
      Component={LicensesPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
      }}
    />
    <Route path={urls.dashboard} Component={DashboardPage}>
      <Route
        path={''}
        Component={GeneralInformationPage}
        handle={{
          tracking: {
            pageName: GENERAL_INFORMATION,
            pageType: PageType.dashboard,
          },
        }}
      >
        <Route
          path={'edit-name'}
          Component={EditNamePage}
          handle={{
            tracking: {
              pageName: 'edit-name',
              pageType: PageType.dashboard,
            },
          }}
        />
      </Route>
      <Route
        path={urls.users}
        Component={UsersPage}
        handle={{
          tracking: {
            pageName: LICENCES,
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          path={urls.users_delete}
          Component={UsersDeletePage}
          handle={{
            tracking: {
              pageName: DELETE_ACCOUNT,
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={urls.users_edit}
          Component={UsersEditPage}
          handle={{
            tracking: {
              pageName: EDIT_ACCOUNT,
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={urls.change_password}
          Component={UsersChangePasswordPage}
          handle={{
            tracking: {
              pageName: EDIT_PASSWORD,
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={urls.order_licenses}
          Component={UsersOrderLicensesPage}
          handle={{
            tracking: {
              pageName: ORDER_ACCOUNT,
              pageType: PageType.popup,
            },
          }}
        />
        <Route
          path={urls.order_users}
          Component={UsersOrderUsersPage}
          handle={{
            tracking: {
              pageName: ORDER_ACCOUNT,
              pageType: PageType.popup,
            },
          }}
        />
      </Route>
      <Route
        path={'consumption'}
        Component={ConsumptionPage}
        handle={{
          tracking: {
            pageName: USAGE,
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
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
