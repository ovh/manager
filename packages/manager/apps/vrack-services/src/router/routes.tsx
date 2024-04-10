import React from 'react';
import { RouteObject } from 'react-router-dom';
import {
  PageType,
  TrackingPageParams,
} from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from './constants';
import RootWrapper from '@/pages/RootWrapper';
import DashboardWrapper from '@/pages/DashboardWrapper';
import { PageName } from '@/utils/tracking';

type RouteConfig = {
  id?: string;
  pageImport: CallableFunction;
  path: string;
  tracking?: TrackingPageParams;
  currentPage?: string;
  children?: any;
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
          pageImport: () => import('@/pages/listing'),
          path: urls.listing,
          currentPage: 'vrack-services.listing',
          tracking: {
            pageType: PageType.listing,
          },
          children: [
            routeConfig({
              pageImport: () => import('@/pages/associate'),
              path: urls.listingAssociate,
              currentPage: 'vrack-services.associate',
              tracking: {
                pageType: PageType.popup,
                pageName: PageName.associate,
              },
            }),
            routeConfig({
              pageImport: () => import('@/pages/listing/Delete'),
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
          pageImport: () => import('@/pages/onboarding'),
          path: urls.onboarding,
          currentPage: 'vrack-services.onboarding',
          tracking: {
            pageType: PageType.onboarding,
          },
        }),
        routeConfig({
          pageImport: () => import('@/pages/create'),
          path: urls.createVrackServices,
          currentPage: 'vrack-services.create',
          tracking: {
            pageType: PageType.funnel,
            pageName: PageName.createVrackServices,
          },
          children: [
            routeConfig({
              pageImport: () => import('@/pages/create/CreateConfirmModal'),
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
              pageImport: () => import('@/pages/overview'),
              path: urls.overview,
              currentPage: 'vrack-services.dashboard',
              tracking: {
                pageType: PageType.dashboard,
                pageName: PageName.overview,
              },
              children: [
                routeConfig({
                  pageImport: () => import('@/pages/associate'),
                  path: urls.overviewAssociate,
                  currentPage: 'vrack-services.dashboard.associate',
                  tracking: {
                    pageType: PageType.popup,
                    pageName: PageName.associate,
                  },
                }),
                routeConfig({
                  pageImport: () => import('@/pages/dissociate'),
                  path: urls.overviewDissociate,
                  currentPage: 'vrack-services.dashboard.dissociate',
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
                  currentPage: 'vrack-services.subnets.onboarding',
                  tracking: {
                    pageType: PageType.onboarding,
                    pageName: PageName.subnets,
                  },
                }),
                routeConfig({
                  pageImport: () => import('@/pages/subnets/Listing'),
                  path: urls.subnetsListing,
                  currentPage: 'vrack-services.subnets.listing',
                  tracking: {
                    pageType: PageType.listing,
                    pageName: PageName.subnets,
                  },
                  children: [
                    routeConfig({
                      pageImport: () => import('@/pages/subnets/Delete'),
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
              pageImport: () => import('@/pages/subnets/Create'),
              path: urls.createSubnet,
              currentPage: 'vrack-services.subnets.create',
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
                  currentPage: 'vrack-services.endpoints.onboarding',
                  tracking: {
                    pageType: PageType.onboarding,
                    pageName: PageName.endpoints,
                  },
                }),
                routeConfig({
                  pageImport: () => import('@/pages/endpoints/Listing'),
                  path: urls.endpointsListing,
                  currentPage: 'vrack-services.endpoints.listing',
                  tracking: {
                    pageType: PageType.listing,
                    pageName: PageName.endpoints,
                  },
                  children: [
                    routeConfig({
                      pageImport: () => import('@/pages/endpoints/Delete'),
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
              pageImport: () => import('@/pages/endpoints/Create'),
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
