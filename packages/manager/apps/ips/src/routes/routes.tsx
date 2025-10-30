import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { subRoutes, urls } from '@/routes/routes.constant';

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

export const Routes: RouteObject[] = [
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
                id: subRoutes.terminateIp,
                path: urls.listingIpTerminate,
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
                id: subRoutes.terminateByoip,
                path: urls.listingByoipTerminate,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/terminate/terminateByoip.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'listing-terminate-byoip',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.moveIp,
                path: urls.listingMoveIp,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/moveIp/moveIp.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'listing-move-ip',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.upsertDescription,
                path: urls.upsertDescription,
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
              {
                id: subRoutes.addVirtualMac,
                path: urls.addVirtualMac,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/virtualMac/addVirtualMac.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'listing-add-virtual-mac',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.viewVirtualMac,
                path: urls.viewVirtualMac,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/virtualMac/viewVirtualMac.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'listing-view-virtual-mac',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.deleteVirtualMac,
                path: urls.deleteVirtualMac,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/virtualMac/deleteVirtualMac.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'listing-delete-virtual-mac',
                  },
                },
              },
              {
                id: subRoutes.importIpFromSys,
                path: urls.listingImportIpFromSys,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/actions/importIpFromSys/importIpFromSys.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: 'import-ip-from-sys',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.unblockAntiHack,
                path: urls.unblockAntiHack,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/antiHack/unblockAntiHack.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'listing-unblock-anti-hack',
                  },
                },
              },
              {
                id: subRoutes.exportIpToCsv,
                path: urls.listingExportIpToCsv,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/exportIpToCsv/exportIpToCsv.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'export-ip-to-csv',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.slice,
                path: urls.slice,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/slice/slice.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'slice',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.aggregate,
                path: urls.aggregate,
                ...lazyRouteConfig(() =>
                  import('@/pages/actions/aggregate/aggregate.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'aggregate',
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
              {
                id: subRoutes.deleteOrganisation,
                path: urls.deleteOrganisation,
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/actions/organisation/deleteOrganisation.page'
                  ),
                ),
                handle: {
                  tracking: {
                    pageName: subRoutes.deleteOrganisation,
                    pageType: PageType.popup,
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
        id: subRoutes.configureEdgeNetworkFirewall,
        path: urls.configureEdgeNetworkFirewall,
        ...lazyRouteConfig(() =>
          import(
            '@/pages/configureEdgeNetworkFirewall/configureEdgeNetworkFirewall.page'
          ),
        ),
        handle: {
          tracking: {
            pageName: 'configure-edge-network-firewall',
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
