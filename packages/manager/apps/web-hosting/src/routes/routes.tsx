import React from 'react';

import { Route, UIMatch } from 'react-router-dom';

import { ICON_NAME } from '@ovhcloud/ods-react';

import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ErrorBoundary } from '@ovh-ux/muk';

import NotFound from '@/pages/404';

import {
  ADD_DOMAIN,
  CREATE,
  DASHBOARD,
  DELETE,
  DISABLE_SSL,
  GENERAL_INFORMATION,
  IMPORT,
  IMPORT_SSL,
  ONBOARDING,
  ORDER_DOMAIN,
  ORDER_SECTIGO,
  SAN_SSL,
  SSL,
  TASK,
  TASKS,
  WEBSITE,
  WORDPRESS_MANAGED,
  WORDPRESS_MANAGED_SERVICE,
} from '../utils/tracking.constants';
import { DashboardLayout, OnboardingPage, RootPage, WebsitesPage } from './pages/default';
import { AddDomainPage, OrderDomainPage } from './pages/domain';
import {
  ManagedWordpressPage,
  ManagedWordpressResourcePage,
  ManagedWordpressServiceCreatePage,
  ManagedWordpressServiceDelete,
  ManagedWordpressServiceGeneralInformationPage,
  ManagedWordpressServiceImportPage,
  ManagedWordpressServiceTasksPage,
} from './pages/managedWordpress';
import { DisableSslPage, ImportSslPage, OrderSectigoPage, SanSslPage, SslPage } from './pages/ssl';
import { OngoingTaskPage } from './pages/task';
import { urls } from './routes.constants';

export type RouteHandle = {
  isOverridePage?: boolean;
  tracking?: {
    pageName?: string;
    pageType?: PageType;
  };
  breadcrumb?: {
    label: string;
    icon?: ICON_NAME;
  };
};
export type RouteMatch = UIMatch<unknown, RouteHandle>;

export default (
  <Route
    id={'root'}
    path={urls.root}
    Component={RootPage}
    errorElement={
      <ErrorBoundary
        redirectionApp="web-hosting-backup"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
    <Route
      id={WORDPRESS_MANAGED}
      path={urls.managedWordpress}
      Component={ManagedWordpressPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: 'managed_wordpress',
        },
      }}
    />

    <Route
      id={WORDPRESS_MANAGED_SERVICE}
      path={urls.managedWordpressResource}
      Component={ManagedWordpressResourcePage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: ':serviceName',
        },
      }}
    >
      <Route
        id={GENERAL_INFORMATION}
        path={urls.managedWordpressResource}
        Component={ManagedWordpressServiceGeneralInformationPage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
        }}
      >
        <Route
          id={DELETE}
          path={urls.managedWordpressResourceDeleteModal}
          Component={ManagedWordpressServiceDelete}
          handle={{
            tracking: {
              pageName: DELETE,
              pageType: PageType.popup,
            },
          }}
        />
      </Route>

      <Route
        id={TASKS}
        path={urls.managedWordpressResourceTasks}
        Component={ManagedWordpressServiceTasksPage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:web_hosting_header_tasks',
          },
        }}
      />
      <Route
        id={CREATE}
        path={urls.managedWordpressResourceCreate}
        Component={ManagedWordpressServiceCreatePage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:create_website',
          },
          isOverridePage: true,
        }}
      />
      <Route
        id={IMPORT}
        path={urls.managedWordpressResourceImport}
        Component={ManagedWordpressServiceImportPage}
        handle={{
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:import_website',
          },
          isOverridePage: true,
        }}
      />
    </Route>
    <Route
      id={WEBSITE}
      path={urls.websites}
      Component={WebsitesPage}
      handle={{
        tracking: {
          pageType: PageType.listing,
        },
        breadcrumb: {
          label: 'websites',
        },
      }}
    />
    <Route
      id={ONBOARDING}
      path={urls.onboarding}
      Component={OnboardingPage}
      handle={{
        tracking: {
          pageType: PageType.onboarding,
        },
      }}
    />
    <Route
      id={DASHBOARD}
      path={urls.dashboard}
      Component={DashboardLayout}
      handle={{
        breadcrumb: { label: ':serviceName' },
      }}
    >
      {/* Project ONE SSL */}
      <Route
        id={SSL}
        path={urls.ssl}
        Component={SslPage}
        handle={{
          tracking: {
            pageName: SSL,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'ssl',
          },
        }}
      ></Route>
      <Route
        id={TASK}
        path={urls.task}
        Component={OngoingTaskPage}
        handle={{
          tracking: {
            pageName: TASK,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'common:web_hosting_header_tasks',
          },
        }}
      />
      <Route
        id={IMPORT_SSL}
        path={urls.importSsl}
        Component={ImportSslPage}
        handle={{
          tracking: {
            pageName: IMPORT_SSL,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={ORDER_SECTIGO}
        path={urls.orderSectigo}
        Component={OrderSectigoPage}
        handle={{
          tracking: {
            pageName: ORDER_SECTIGO,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={DISABLE_SSL}
        path={urls.disableSsl}
        Component={DisableSslPage}
        handle={{
          tracking: {
            pageName: DISABLE_SSL,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={SAN_SSL}
        path={urls.sanSsl}
        Component={SanSslPage}
        handle={{
          tracking: {
            pageName: SAN_SSL,
            pageType: PageType.popup,
          },
        }}
      />

      <Route
        id={ADD_DOMAIN}
        path={urls.addDomain}
        Component={AddDomainPage}
        handle={{
          tracking: {
            pageName: ADD_DOMAIN,
            pageType: PageType.popup,
          },
        }}
      />
      <Route
        id={ORDER_DOMAIN}
        path={urls.orderDomain}
        Component={OrderDomainPage}
        handle={{
          tracking: {
            pageName: ORDER_DOMAIN,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
