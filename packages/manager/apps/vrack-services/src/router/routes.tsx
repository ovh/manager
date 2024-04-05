import React from 'react';
import { RouteObject } from 'react-router-dom';
import NotFound from '@/pages/404';
import { urls } from './constants';
import RootWrapper from '@/pages/RootWrapper';
import DashboardWrapper from '@/pages/DashboardWrapper';
import { getPageProps, PageName, PageType } from '@/utils/tracking';

type RouteConfig = {
  id?: string;
  pageImport: CallableFunction;
  path: string;
  tracking?: {
    pageType: PageType;
    pageName?: PageName;
  };
  children?: any;
};

export const getRoutes = (
  trackPage: (trackingProps: unknown) => PromiseLike<void>,
): RouteObject[] => {
  const routeConfig = ({
    pageImport,
    path,
    tracking,
    ...props
  }: RouteConfig) => {
    return {
      ...props,
      path,
      loader: (): unknown => {
        if (tracking) {
          trackPage(getPageProps(tracking));
        }
        return null;
      },
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
          pageImport: () => import('@/pages/listing'),
          path: urls.listing,
          tracking: {
            pageType: PageType.listing,
          },
          children: [
            routeConfig({
              pageImport: () => import('@/pages/associate'),
              path: urls.listingAssociate,
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.associate,
              },
            }),
            routeConfig({
              pageImport: () => import('@/pages/listing/Delete'),
              path: urls.listingDelete,
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.delete,
              },
            }),
          ],
        }),
        routeConfig({
          pageImport: () => import('@/pages/onboarding'),
          path: urls.onboarding,
          tracking: {
            pageType: PageType.onboarding,
          },
        }),
        routeConfig({
          pageImport: () => import('@/pages/create'),
          path: urls.createVrackServices,
          tracking: {
            pageType: PageType.funnel,
            pageName: PageName.createVrackServices,
          },
          children: [
            routeConfig({
              pageImport: () => import('@/pages/create/CreateConfirmModal'),
              path: urls.createConfirm,
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
              pageImport: () => import('@/pages/overview'),
              path: urls.overview,
              tracking: {
                pageType: PageType.dashboard,
                pageName: PageName.overview,
              },
              children: [
                routeConfig({
                  pageImport: () => import('@/pages/associate'),
                  path: urls.overviewAssociate,
                  tracking: {
                    pageType: PageType.popup,
                    pageName: PageName.associate,
                  },
                }),
                routeConfig({
                  pageImport: () => import('@/pages/dissociate'),
                  path: urls.overviewDissociate,
                  tracking: {
                    pageType: PageType.popup,
                    pageName: PageName.dissociate,
                  },
                }),
              ],
            }),
            routeConfig({
              pageImport: () => import('@/pages/subnets'),
              path: urls.subnets,
              children: [
                routeConfig({
                  pageImport: () => import('@/pages/subnets/Onboarding'),
                  path: urls.subnetsOnboarding,
                  tracking: {
                    pageType: PageType.onboarding,
                    pageName: PageName.subnets,
                  },
                }),
                routeConfig({
                  pageImport: () => import('@/pages/subnets/Listing'),
                  path: urls.subnetsListing,
                  tracking: {
                    pageType: PageType.listing,
                    pageName: PageName.subnets,
                  },
                  children: [
                    routeConfig({
                      pageImport: () => import('@/pages/subnets/Delete'),
                      path: urls.subnetsDelete,
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
              pageImport: () => import('@/pages/subnets/Create'),
              path: urls.createSubnet,
              tracking: {
                pageType: PageType.funnel,
                pageName: PageName.createSubnets,
              },
            }),
            routeConfig({
              pageImport: () => import('@/pages/endpoints'),
              path: urls.endpoints,
              children: [
                routeConfig({
                  pageImport: () => import('@/pages/endpoints/Onboarding'),
                  path: urls.endpointsOnboarding,
                  tracking: {
                    pageType: PageType.onboarding,
                    pageName: PageName.endpoints,
                  },
                }),
                routeConfig({
                  pageImport: () => import('@/pages/endpoints/Listing'),
                  path: urls.endpointsListing,
                  tracking: {
                    pageType: PageType.listing,
                    pageName: PageName.endpoints,
                  },
                  children: [
                    routeConfig({
                      pageImport: () => import('@/pages/endpoints/Delete'),
                      path: urls.endpointsDelete,
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
              pageImport: () => import('@/pages/endpoints/Create'),
              path: urls.createEndpoint,
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
