import React from 'react';

import { Route } from 'react-router-dom';

import { ErrorBoundary } from '@ovh-ux/manager-react-components';
import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';
import {
  ADD_DOMAIN,
  DASHBOARD,
  DISABLE_SSL,
  IMPORT_SSL,
  LOCAL_SEO,
  ONBOARDING,
  ORDER_DOMAIN,
  ORDER_SECTIGO,
  REMOVE_SEO_SUBSCIPTION,
  SAN_SSL,
  SSL,
  WEBSITE,
} from '@/utils/tracking.constants';

const RootPage = React.lazy(() => import('@/pages/layout'));
const WebsitesPage = React.lazy(() => import('@/pages/websites/Websites.page'));
const OnboardingPage = React.lazy(() => import('@/pages/onboarding/Onboarding.page'));
const DashboardLayout = React.lazy(() => import('@/pages/dashboard/layout'));
const SslPage = React.lazy(() => import('@/pages/dashboard/ssl/Ssl.page'));
const ImportSslPage = React.lazy(() => import('@/pages/dashboard/ssl/add/importSsl.page'));
const OrderSectigoPage = React.lazy(() => import('@/pages/dashboard/ssl/add/orderSectigo.page'));
const DisableSslPage = React.lazy(() => import('@/pages/dashboard/ssl/manage/disableSsl.page'));
const SanSslPage = React.lazy(() => import('@/pages/dashboard/ssl/manage/sanSsl.page'));
const AddDomainPage = React.lazy(() => import('@/pages/dashboard/AddDomain.page'));
const OrderDomainPage = React.lazy(() => import('@/pages/dashboard/OrderDomain.page'));
const LocalSeoPage = React.lazy(() => import('@/pages/dashboard/local-seo/LocalSeo.page'));
const RemoveSeoSubscriptionPage = React.lazy(
  () => import('@/pages/dashboard/local-seo/manage/RemoveSeoSubscription.page'),
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
      <Route
        id={LOCAL_SEO}
        path={urls.localSeo}
        Component={LocalSeoPage}
        handle={{
          tracking: {
            pageName: LOCAL_SEO,
            pageType: PageType.listing,
          },
        }}
      />
      <Route
        id={REMOVE_SEO_SUBSCIPTION}
        path={urls.removeSeoSubsciption}
        Component={RemoveSeoSubscriptionPage}
        handle={{
          tracking: {
            pageName: REMOVE_SEO_SUBSCIPTION,
            pageType: PageType.popup,
          },
        }}
      />
    </Route>
    <Route path={'*'} element={<NotFound />} />
  </Route>
);
