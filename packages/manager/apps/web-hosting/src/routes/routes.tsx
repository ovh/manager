import React from 'react';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constants';
import {
  DASHBOARD,
  GENERAL_INFORMATIONS,
  ONBOARDING,
  WEBSITES,
} from '@/tracking.constants';

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
        id: WEBSITES,
        path: urls.websites,
        ...lazyRouteConfig(() => import('@/pages/websites/Websites.page')),
        handle: {
          tracking: {
            pageName: WEBSITES,
            pageType: PageType.listing,
          },
          breadcrumb: {
            label: 'websites',
          },
        },
      },
      {
        id: DASHBOARD,
        path: urls.dashboard,
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.page')),
        handle: {
          tracking: {
            pageName: GENERAL_INFORMATIONS,
            pageType: PageType.dashboard,
          },
          breadcrumb: {
            label: ':serviceName',
          },
        },
        children: [
          {
            id: GENERAL_INFORMATIONS,
            path: '',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/dashboard/generalInformations/GeneralInformations.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: GENERAL_INFORMATIONS,
                pageType: PageType.dashboard,
              },
              breadcrumb: {
                label: 'general_informations',
              },
            },
            children: [
              {
                id: 'test',
                path: '/:serviceName/:test',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/generalInformations/GeneralInformations.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: GENERAL_INFORMATIONS,
                    pageType: PageType.dashboard,
                  },
                  breadcrumb: {
                    label: ':test',
                  },
                },
              },
            ],
          },
        ],
      },
      {
        id: ONBOARDING,
        path: urls.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding/Onboarding.page')),
        handle: {
          tracking: {
            pageName: ONBOARDING,
            pageType: PageType.onboarding,
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
