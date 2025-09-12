import React from 'react';

import { Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import {
  DELETE_ACCOUNT,
  EDIT_ACCOUNT,
  EDIT_PASSWORD,
  GENERAL_INFORMATION,
  LICENCES,
  ORDER_ACCOUNT,
  USAGE,
} from '@/Tracking.constants';
import NotFound from '@/pages/404';
import { urls } from '@/routes/Routes.constants';

const LayoutPage = React.lazy(() => import('@/pages/layout'));
const LicensesPage = React.lazy(() => import('@/pages/licenses/Licenses.page'));
const DashboardPage = React.lazy(() => import('@/pages/dashboard/Dashboard.page'));
const GeneralInformationPage = React.lazy(
  () => import('@/pages/dashboard/general-information/GeneralInformation.page'),
);
const EditNamePage = React.lazy(
  () => import('@/pages/dashboard/general-information/update-display-name/UpdateDisplayName.modal'),
);
const UsersPage = React.lazy(() => import('@/pages/dashboard/users/Users.page'));
const UsersDeletePage = React.lazy(
  () => import('@/pages/dashboard/users/delete-users/DeleteUsers.modal'),
);
const UsersEditPage = React.lazy(
  () => import('@/pages/dashboard/users/edit-users/EditUsers.modal'),
);
const UsersChangePasswordPage = React.lazy(
  () => import('@/pages/dashboard/users/change-password-users/ChangePasswordUsers.modal'),
);
const UsersOrderLicensesPage = React.lazy(
  () => import('@/pages/dashboard/users/order-licenses/OrderLicenses.modal'),
);
const UsersOrderUsersPage = React.lazy(
  () => import('@/pages/dashboard/users/order-users/OrderUsers.modal'),
);
const ConsumptionPage = React.lazy(() => import('@/pages/dashboard/consumption/Consumption.page'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));

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
