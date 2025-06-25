import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { subRoutes, urls } from '@/routes/routes.constant';

const lazyRouteConfig = (importFn: CallableFunction): Partial<RouteObject> => {
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

export const Routes: any = [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        id: 'listing',
        path: urls.listing,
        ...lazyRouteConfig(() => import('@/pages/listing')),
        children: [
          {
            id: 'ips',
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/listing/ipListing/ip.listing.page'),
            ),
            handle: {
              tracking: {
                pageName: 'ips',
                pageType: PageType.listing,
              },
            },
            children: [
              {
                id: subRoutes.configureReverseDns,
                path: urls.listingConfigureReverseDns,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/actions/configureReverseDns/configureReverseDns.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: subRoutes.configureReverseDns,
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.terminate,
                path: urls.listingTerminate,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/terminate/terminateIp.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'listing-terminate-ip',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.upsertDescription,
                path: urls.listingUpsertDescription,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/actions/upsertDescription/upsertDescription.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'listing-upsert-description',
                    pageType: PageType.popup,
                  },
                },
              },
            ],
          },
          {
            id: 'manage-organisations',
            path: urls.manageOrganisations,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/listing/manageOrganisations/manage.organisations.page'
              ),
            ),
            children: [
              {
                id: 'open',
                path: urls.openOrganisationsModal,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/listing/manageOrganisations/OrganisationModal/OrganisationModal.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'manage-organisations-open',
                    pageType: PageType.listing,
                  },
                },
              },
            ],
            handle: {
              tracking: {
                pageName: 'manage-organisations',
                pageType: PageType.listing,
              },
            },
          },
        ],
        handle: {
          tracking: {
            pageName: 'listing',
            pageType: PageType.listing,
          },
        },
      },
      {
        id: subRoutes.configureGameFirewall,
        path: urls.configureGameFirewall,
        ...lazyRouteConfig(() =>
          import('@/pages/configureGameFirewall/configureGameFirewall.page'),
        ),
        handle: {
          tracking: {
            pageName: 'configure-game-firewall',
            pageType: PageType.listing,
          },
        },
      },
      {
        id: 'onboarding',
        path: urls.onboarding,
        ...lazyRouteConfig(() => import('@/pages/onboarding')),
        handle: {
          tracking: {
            pageName: 'onboarding',
            pageType: PageType.onboarding,
          },
        },
      },
      {
        id: 'order',
        path: urls.order,
        ...lazyRouteConfig(() => import('@/pages/order/Order.page')),
        handle: {
          tracking: {
            pageName: 'order',
            pageType: PageType.funnel,
          },
        },
      },
      {
        id: 'byoip',
        path: urls.byoip,
        ...lazyRouteConfig(() => import('@/pages/byoip/Byoip.page')),
        children: [
          {
            id: 'byoip-order',
            path: urls.byoipOrderModal,
            ...lazyRouteConfig(() =>
              import('@/pages/byoip/ByoipOrderModal/ByoipOrderModal.page'),
            ),
            handle: {
              tracking: {
                pageName: 'byoip-order',
                pageType: PageType.listing,
              },
            },
          },
        ],
        handle: {
          tracking: {
            pageName: 'byoip',
            pageType: PageType.funnel,
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
