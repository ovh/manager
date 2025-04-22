import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
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

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();
      return {
        Component: moduleDefault,
        ...moduleExports,
      };
    },
  };
};

export default [
  {
    id: 'root',
    path: urls.root,
    ...lazyRouteConfig(() => import('@/pages/layout')),
    handle: {
      breadcrumb: {
        icon: ODS_ICON_NAME.home,
      },
    },
    children: [
      {
        id: WEBSITE,
        path: urls.websites,
        ...lazyRouteConfig(() => import('@/pages/websites/Websites.page')),
        handle: {
          tracking: {
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'websites',
          },
        },
      },
      {
        id: ONBOARDING,
        path: urls.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding/Onboarding.page')),
        handle: {
          tracking: {
            pageType: PageType.onboarding,
          },
        },
      },
    ],
  },
  {
    id: DASHBOARD,
    path: urls.dashboard,
    ...lazyRouteConfig(() => import('@/pages/dashboard/layout')),
    handle: {
      breadcrumb: {
        label: ':serviceName',
      },
    },
    children: [
      {
        id: SSL,
        path: urls.ssl,
        ...lazyRouteConfig(() => import('@/pages/dashboard/ssl/Ssl.page')),
        handle: {
          tracking: {
            pageName: SSL,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'ssl',
          },
        },
      },
      {
        id: IMPORT_SSL,
        path: urls.importSsl,
        ...lazyRouteConfig(() =>
          import('@/pages/dashboard/ssl/add/importSsl.page'),
        ),
        handle: {
          tracking: {
            pageName: IMPORT_SSL,
            pageType: PageType.popup,
          },
        },
      },
      {
        id: ORDER_SECTIGO,
        path: urls.orderSectigo,
        ...lazyRouteConfig(() =>
          import('@/pages/dashboard/ssl/add/orderSectigo.page'),
        ),
        handle: {
          tracking: {
            pageName: ORDER_SECTIGO,
            pageType: PageType.popup,
          },
        },
      },
      {
        id: DISABLE_SSL,
        path: urls.disableSsl,
        ...lazyRouteConfig(() =>
          import('@/pages/dashboard/ssl/manage/disableSsl.page'),
        ),
        handle: {
          tracking: {
            pageName: DISABLE_SSL,
            pageType: PageType.popup,
          },
        },
      },
      {
        id: REGENERATE_SSL,
        path: urls.regenerateSsl,
        ...lazyRouteConfig(() =>
          import('@/pages/dashboard/ssl/manage/regenerateSsl.page'),
        ),
        handle: {
          tracking: {
            pageName: REGENERATE_SSL,
            pageType: PageType.popup,
          },
        },
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
