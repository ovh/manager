import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { Route, UIMatch } from 'react-router-dom';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';
import {
  ADD_DOMAIN,
  DASHBOARD,
  IMPORT_SSL,
  DISABLE_SSL,
  ONBOARDING,
  ORDER_SECTIGO,
  ORDER_DOMAIN,
  SSL,
  WEBSITE,
  WORDPRESS_MANAGED,
  WORDPRESS_MANAGED_SERVICE,
  SAN_SSL,
  GENERAL_INFORMATION,
  TASKS,
  IMPORT,
  DELETE,
  CREATE,
} from '@/utils/tracking.constants';

export type RouteHandle = {
  isOverridePage?: boolean;
  tracking?: {
    pageName?: string;
    pageType?: PageType;
  };
  breadcrumb?: {
    label: string;
    icon?: ODS_ICON_NAME;
  };
};

export type RouteMatch = UIMatch<unknown, RouteHandle>;

const RootPage = React.lazy(() => import('@/pages/layout'));
const WebsitesPage = React.lazy(() => import('@/pages/websites/Websites.page'));
const ManagedWordpressPage = React.lazy(() =>
  import('@/pages/managedWordpress/ManagedWordpress.page'),
);
const ManagedWordpressResourcePage = React.lazy(() =>
  import(
    '@/pages/managedWordpress/ManagedWordpressResource/ManagedWordpressResource.page'
  ),
);
const ManagedWordpressServiceGeneralInformationPage = React.lazy(() =>
  import(
    '@/pages/managedWordpress/ManagedWordpressResource/myWebsites/MyWebsites.page'
  ),
);

const ManagedWordpressServiceCreatePage = React.lazy(() =>
  import(
    '@/pages/managedWordpress/ManagedWordpressResource/create/Create.page'
  ),
);

const ManagedWordpressServiceTasksPage = React.lazy(() =>
  import('@/pages/managedWordpress/ManagedWordpressResource/tasks/Tasks.page'),
);
const ManagedWordpressServiceImportPage = React.lazy(() =>
  import(
    '@/pages/managedWordpress/ManagedWordpressResource/import/Import.page'
  ),
);

const ManagedWordpressServiceDelete = React.lazy(() =>
  import(
    '@/pages/managedWordpress/ManagedWordpressResource/delete/Delete.modal'
  ),
);
const OnboardingPage = React.lazy(() =>
  import('@/pages/onboarding/Onboarding.page'),
);
const DashboardLayout = React.lazy(() => import('@/pages/dashboard/layout'));
const SslPage = React.lazy(() => import('@/pages/dashboard/ssl/Ssl.page'));
const ImportSslPage = React.lazy(() =>
  import('@/pages/dashboard/ssl/add/importSsl.page'),
);
const OrderSectigoPage = React.lazy(() =>
  import('@/pages/dashboard/ssl/add/orderSectigo.page'),
);
const DisableSslPage = React.lazy(() =>
  import('@/pages/dashboard/ssl/manage/disableSsl.page'),
);
const SanSslPage = React.lazy(() =>
  import('@/pages/dashboard/ssl/manage/sanSsl.page'),
);
const AddDomainPage = React.lazy(() =>
  import('@/pages/dashboard/AddDomain.page'),
);
const OrderDomainPage = React.lazy(() =>
  import('@/pages/dashboard/OrderDomain.page'),
);
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
