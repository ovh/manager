import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { Route } from 'react-router-dom';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';
import {
  DASHBOARD,
  IMPORT_SSL,
  DISABLE_SSL,
  ONBOARDING,
  ORDER_SECTIGO,
  REGENERATE_SSL,
  SSL,
  WEBSITE,
} from '@/utils/tracking.constants';

const RootPage = React.lazy(() => import('@/pages/layout'));
const WebsitesPage = React.lazy(() => import('@/pages/websites/Websites.page'));
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
const RegenerateSslPage = React.lazy(() =>
  import('@/pages/dashboard/ssl/manage/regenerateSsl.page'),
);

export default (
  <Route
    id={'root'}
    path={urls.root}
    Component={RootPage}
    handle={{
      breadcrumb: {
        icon: ODS_ICON_NAME.home,
      },
    }}
    errorElement={
      <ErrorBoundary
        redirectionApp="web-hosting-backup"
        isPreloaderHide={true}
        isRouteShellSync={true}
      />
    }
  >
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
        id={REGENERATE_SSL}
        path={urls.regenerateSsl}
        Component={RegenerateSslPage}
        handle={{
          tracking: {
            pageName: REGENERATE_SSL,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
