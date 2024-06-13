import React from 'react';
import { RouteObject } from 'react-router-dom';
import {
  PageType,
  TrackingPageParams,
} from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/not-found/404.page';
import { urls } from './routes.constants';
import RootWrapper from '@/pages/RootWrapper.page';
import DashboardWrapper from '@/pages/DashboardWrapper.page';
import { PageName } from '@/utils/tracking';

export type RouteConfig = {
  id?: string;
  pageImport: CallableFunction;
  path: string;
  tracking?: TrackingPageParams;
  currentPage?: string;
  children?: RouteObject[];
};

export const getRoutes = (): RouteObject[] => {
  const routeConfig = ({
    pageImport,
    path,
    tracking,
    currentPage,
    ...props
  }: RouteConfig) => {
    return {
      ...props,
      path,
      handle: { tracking, currentPage },
      lazy: async () => {
        const { default: moduleDefault, ...moduleExports } = await pageImport();
        return {
          Component: moduleDefault,
          ...moduleExports,
        };
      },
    };
  };

  return [
    {
      path: urls.root,
      Component: RootWrapper,
      children: [
        routeConfig({
          pageImport: () => import('@/pages/listing/Listing.page'),
          path: urls.listing,
          currentPage: 'vrack-services.listing',
          tracking: {
            pageType: PageType.listing,
          },
          children: [
            routeConfig({
              pageImport: () =>
                import('@/pages/associate/AssociateVrackModal.page'),
              path: urls.listingAssociate,
              currentPage: 'vrack-services.associate',
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.associate,
              },
            }),
            routeConfig({
              pageImport: () =>
                import(
                  '@/pages/associate-another/AssociateAnotherVrackModal.page'
                ),
              path: urls.listingAssociateAnother,
              currentPage: 'vrack-services.associate-another',
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.associateAnother,
              },
            }),
            routeConfig({
              pageImport: () =>
                import('@/pages/dissociate/DissociateModal.page'),
              path: urls.listingDissociate,
              currentPage: 'vrack-services.dissociate',
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.dissociate,
              },
            }),
            routeConfig({
              pageImport: () =>
                import(
                  '@/pages/edit-display-name/EditVrackServicesDisplayNameModal.page'
                ),
              path: urls.listingEdit,
              currentPage: 'vrack-services.listing.edit',
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.edit,
              },
            }),
            routeConfig({
              pageImport: () =>
                import('@/pages/listing/delete/DeleteVrackServicesModal.page'),
              path: urls.listingDelete,
              currentPage: 'vrack-services.listing.delete',
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.delete,
              },
            }),
          ],
        }),
        routeConfig({
          pageImport: () => import('@/pages/onboarding/Onboarding.page'),
          path: urls.onboarding,
          currentPage: 'vrack-services.onboarding',
          tracking: {
            pageType: PageType.onboarding,
          },
        }),
        routeConfig({
          pageImport: () =>
            import('@/pages/create-vs/CreateVrackServices.page'),
          path: urls.createVrackServices,
          currentPage: 'vrack-services.create',
          tracking: {
            pageType: PageType.funnel,
            pageName: PageName.createVrackServices,
          },
          children: [
            routeConfig({
              pageImport: () =>
                import('@/pages/create-vs/confirm/CreateConfirmModal.page'),
              path: urls.createConfirm,
              currentPage: 'vrack-services.create',
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.createVrackServices,
              },
            }),
          ],
        }),
        {
          path: urls.dashboard,
          Component: DashboardWrapper,
          children: [
            routeConfig({
              pageImport: () => import('@/pages/overview/OverviewTab.page'),
              path: urls.overview,
              currentPage: 'vrack-services.dashboard',
              tracking: {
                pageType: PageType.dashboard,
                pageName: PageName.overview,
              },
              children: [
                routeConfig({
                  pageImport: () =>
                    import('@/pages/associate/AssociateVrackModal.page'),
                  path: urls.overviewAssociate,
                  currentPage: 'vrack-services.dashboard.associate',
                  tracking: {
                    pageType: PageType.popup,
                    pageName: PageName.associate,
                  },
                }),
                routeConfig({
                  pageImport: () =>
                    import('@/pages/dissociate/DissociateModal.page'),
                  path: urls.overviewDissociate,
                  currentPage: 'vrack-services.dashboard.dissociate',
                  tracking: {
                    pageType: PageType.popup,
                    pageName: PageName.dissociate,
                  },
                }),
                routeConfig({
                  pageImport: () =>
                    import(
                      '@/pages/edit-display-name/EditVrackServicesDisplayNameModal.page'
                    ),
                  path: urls.overviewEdit,
                  currentPage: 'vrack-services.dashboard.edit',
                  tracking: {
                    pageType: PageType.popup,
                    pageName: PageName.edit,
                  },
                }),
                routeConfig({
                  pageImport: () =>
                    import(
                      '@/pages/associate-another/AssociateAnotherVrackModal.page'
                    ),
                  path: urls.overviewAssociateAnother,
                  currentPage: 'vrack-services.dashboard.associate-another',
                  tracking: {
                    pageType: PageType.popup,
                    pageName: PageName.associateAnother,
                  },
                }),
              ],
            }),
            routeConfig({
              pageImport: () => import('@/pages/subnets/SubnetsTab.page'),
              path: urls.subnets,
              children: [
                routeConfig({
                  pageImport: () =>
                    import('@/pages/subnets/onboarding/SubnetsOnboarding.page'),
                  path: urls.subnetsOnboarding,
                  currentPage: 'vrack-services.subnets.onboarding',
                  tracking: {
                    pageType: PageType.onboarding,
                    pageName: PageName.subnets,
                  },
                }),
                routeConfig({
                  pageImport: () =>
                    import(
                      '@/pages/subnets/subnets-listing/SubnetsListing.page'
                    ),
                  path: urls.subnetsListing,
                  currentPage: 'vrack-services.subnets.listing',
                  tracking: {
                    pageType: PageType.listing,
                    pageName: PageName.subnets,
                  },
                  children: [
                    routeConfig({
                      pageImport: () =>
                        import(
                          '@/pages/subnets/edit/EditSubnetDisplayNameModal.page'
                        ),
                      path: urls.subnetsEdit,
                      currentPage: 'vrack-services.subnets.listing.edit',
                      tracking: {
                        pageType: PageType.popup,
                        pageName: PageName.editSubnets,
                      },
                    }),
                    routeConfig({
                      pageImport: () =>
                        import('@/pages/subnets/delete/SubnetDeleteModal.page'),
                      path: urls.subnetsDelete,
                      currentPage: 'vrack-services.subnets.listing.delete',
                      tracking: {
                        pageType: PageType.popup,
                        pageName: PageName.deleteSubnets,
                      },
                    }),
                  ],
                }),
              ],
            }),
            routeConfig({
              pageImport: () =>
                import('@/pages/create-subnet/SubnetCreate.page'),
              path: urls.createSubnet,
              currentPage: 'vrack-services.subnets.create',
              tracking: {
                pageType: PageType.funnel,
                pageName: PageName.createSubnets,
              },
            }),
            routeConfig({
              pageImport: () => import('@/pages/endpoints/EndpointsTab.page'),
              path: urls.endpoints,
              children: [
                routeConfig({
                  pageImport: () =>
                    import(
                      '@/pages/endpoints/onboarding/EndpointsOnboarding.page'
                    ),
                  path: urls.endpointsOnboarding,
                  currentPage: 'vrack-services.endpoints.onboarding',
                  tracking: {
                    pageType: PageType.onboarding,
                    pageName: PageName.endpoints,
                  },
                }),
                routeConfig({
                  pageImport: () =>
                    import(
                      '@/pages/endpoints/endpoints-listing/EndpointsListing.page'
                    ),
                  path: urls.endpointsListing,
                  currentPage: 'vrack-services.endpoints.listing',
                  tracking: {
                    pageType: PageType.listing,
                    pageName: PageName.endpoints,
                  },
                  children: [
                    routeConfig({
                      pageImport: () =>
                        import(
                          '@/pages/endpoints/edit/EditEndpointDisplayName.page'
                        ),
                      path: urls.endpointsEdit,
                      currentPage: 'vrack-services.endpoints.listing.edit',
                      tracking: {
                        pageType: PageType.popup,
                        pageName: PageName.editEndpoints,
                      },
                    }),
                    routeConfig({
                      pageImport: () =>
                        import(
                          '@/pages/endpoints/delete/EndpointDeleteModal.page'
                        ),
                      path: urls.endpointsDelete,
                      currentPage: 'vrack-services.endpoints.listing.delete',
                      tracking: {
                        pageType: PageType.popup,
                        pageName: PageName.deleteEndpoints,
                      },
                    }),
                  ],
                }),
              ],
            }),
            routeConfig({
              pageImport: () =>
                import('@/pages/create-endpoint/EndpointCreate.page'),
              path: urls.createEndpoint,
              currentPage: 'vrack-services.endpoints.create',
              tracking: {
                pageType: PageType.funnel,
                pageName: PageName.createEndpoints,
              },
            }),
          ],
        },
      ],
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ];
};
