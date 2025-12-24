import { RouteObject } from 'react-router-dom';

import { PageType } from '@ovh-ux/manager-react-shell-client';

import NotFound from '@/pages/404';
import { subRoutes, urls } from '@/routes/routes.constant';

const lazyRouteConfig = (importFn: () => Promise<Record<string, unknown>>) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();
      return {
        Component: moduleDefault as React.ComponentType,
        ...(moduleExports as Record<string, unknown>),
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
            ...lazyRouteConfig(
              () => import('@/pages/listing/ipListing/ip.listing.page'),
            ),
            handle: {
              tracking: {
                pageName: 'all-ip',
                pageType: PageType.listing,
              },
            },
            children: [
              {
                id: subRoutes.configureReverseDns,
                path: urls.listingConfigureReverseDns,
                ...lazyRouteConfig(
                  () =>
                    import(
                      '@/pages/actions/configureReverseDns/configureReverseDns.page'
                    ),
                ),
                handle: {
                  tracking: {
                    pageName: 'configure_reverse-dns',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.terminateIp,
                path: urls.listingIpTerminate,
                ...lazyRouteConfig(
                  () => import('@/pages/actions/terminate/terminateIp.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'terminate_additional-ip',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.terminateByoip,
                path: urls.listingByoipTerminate,
                ...lazyRouteConfig(
                  () => import('@/pages/actions/terminate/terminateByoip.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'terminate_bring-your-own-ip',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.moveIp,
                path: urls.listingMoveIp,
                ...lazyRouteConfig(
                  () => import('@/pages/actions/moveIp/moveIp.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'configure_move-ip',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.upsertDescription,
                path: urls.upsertDescription,
                ...lazyRouteConfig(
                  () =>
                    import(
                      '@/pages/actions/upsertDescription/upsertDescription.page'
                    ),
                ),
                handle: {
                  tracking: {
                    pageName: 'edit_description',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.addVirtualMac,
                path: urls.addVirtualMac,
                ...lazyRouteConfig(
                  () => import('@/pages/actions/virtualMac/addVirtualMac.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'add_virtual-mac',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.viewVirtualMac,
                path: urls.viewVirtualMac,
                ...lazyRouteConfig(
                  () =>
                    import('@/pages/actions/virtualMac/viewVirtualMac.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'view_virtual-mac',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.ipBlockInformation,
                path: urls.ipBlockInformation,
                ...lazyRouteConfig(
                  () =>
                    import(
                      '@/pages/actions/upsertIpBlockInformation/upsertIpBlockInformation.page'
                    ),
                ),
                handle: {
                  tracking: {
                    pageName: 'edit_ip-block-information',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.deleteVirtualMac,
                path: urls.deleteVirtualMac,
                ...lazyRouteConfig(
                  () =>
                    import('@/pages/actions/virtualMac/deleteVirtualMac.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'delete_virtual-mac',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.importIpFromSys,
                path: urls.listingImportIpFromSys,
                ...lazyRouteConfig(
                  () =>
                    import(
                      '@/pages/actions/importIpFromSys/importIpFromSys.page'
                    ),
                ),
                handle: {
                  tracking: {
                    pageName: 'import_sys-ip',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.unblockAntiHack,
                path: urls.unblockAntiHack,
                ...lazyRouteConfig(
                  () => import('@/pages/actions/antiHack/unblockAntiHack.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'configure_unblock-anti-hack',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.unblockAntiSpam,
                path: urls.unblockAntiSpam,
                ...lazyRouteConfig(
                  () => import('@/pages/actions/antiSpam/unblockAntiSpam.page'),
                ),
                handle: {
                  tracking: {
                    pageName: 'configure_unblock-anti-spam',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.exportIpToCsv,
                path: urls.listingExportIpToCsv,
                ...lazyRouteConfig(
                  () =>
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
                ...lazyRouteConfig(
                  () => import('@/pages/actions/slice/slice.page'),
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
                ...lazyRouteConfig(
                  () => import('@/pages/actions/aggregate/aggregate.page'),
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
            ...lazyRouteConfig(
              () =>
                import(
                  '@/pages/listing/manageOrganisations/manage.organisations.page'
                ),
            ),
            children: [
              {
                id: 'open',
                path: urls.openOrganisationsModal,
                ...lazyRouteConfig(
                  () =>
                    import(
                      '@/pages/listing/manageOrganisations/OrganisationModal/OrganisationModal.page'
                    ),
                ),
                handle: {
                  tracking: {
                    pageName: 'edit_manage-organizations',
                    pageType: PageType.popup,
                  },
                },
              },
              {
                id: subRoutes.deleteOrganisation,
                path: urls.deleteOrganisation,
                ...lazyRouteConfig(
                  () =>
                    import(
                      '@/pages/actions/organisation/deleteOrganisation.page'
                    ),
                ),
                handle: {
                  tracking: {
                    pageName: 'delete_manage-organizations',
                    pageType: PageType.popup,
                  },
                },
              },
            ],
            handle: {
              tracking: {
                pageName: 'manage-organizations',
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
        ...lazyRouteConfig(
          () =>
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
        ...lazyRouteConfig(
          () =>
            import(
              '@/pages/configureEdgeNetworkFirewall/configureEdgeNetworkFirewall.page'
            ),
        ),
        handle: {
          tracking: {
            pageName: 'configure-edge-firewall',
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
            pageName: '',
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
            pageName: 'order_ip',
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
            ...lazyRouteConfig(
              () =>
                import('@/pages/byoip/ByoipOrderModal/ByoipOrderModal.page'),
            ),
            handle: {
              tracking: {
                pageName: 'bring-your-own_ip',
                pageType: PageType.popup,
              },
            },
          },
        ],
        handle: {
          tracking: {
            pageName: 'bring-your-own_ip',
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
