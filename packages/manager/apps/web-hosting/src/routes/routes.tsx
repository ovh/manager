import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';
import {
  DASHBOARD,
  ONBOARDING,
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
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
