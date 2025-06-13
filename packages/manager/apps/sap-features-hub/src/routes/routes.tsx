import React from 'react';
import { RouteObject } from 'react-router-dom';
import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404';
import { urls } from '@/routes/routes.constant';
import { wizardPageName } from '@/tracking.constants';

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
    path: urls.root,
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: urls.dashboard,
        ...lazyRouteConfig(() => import('@/pages/dashboard')),
        children: [
          {
            id: 'dashboard',
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/general-informations'),
            ),
            handle: {
              tracking: {
                pageName: '',
                pageType: PageType.dashboard,
              },
            },
          },
        ],
      },
      {
        id: 'listing',
        path: urls.listing,
        ...lazyRouteConfig(() =>
          import('@/pages/listing/InstallationHistory.page'),
        ),
        handle: {
          tracking: {
            pageName: 'history',
            pageType: PageType.listing,
          },
        },
      },
      {
        id: 'dashboard.installationDashboard',
        path: urls.installationReport,
        ...lazyRouteConfig(() =>
          import(
            '@/pages/dashboard/installationDetails/InstallationDetails.page'
          ),
        ),
        handle: {
          tracking: {
            pageName: 'history-detail',
            pageType: PageType.dashboard,
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
        path: urls.installationWizard,
        ...lazyRouteConfig(() =>
          import('@/pages/installation/InstallationDashboard.page'),
        ),
        children: [
          {
            id: 'wizard',
            path: '',
            ...lazyRouteConfig(() =>
              import('@/pages/installation/wizardStep/InstallationWizard.page'),
            ),
            handle: {
              tracking: {
                pageName: wizardPageName,
                pageType: PageType.popup,
              },
            },
          },
          {
            id: 'initialStep',
            path: urls.installationInitialStep,
            ...lazyRouteConfig(() =>
              import(
                '@/pages/installation/initialStep/InstallationInitialStep.page'
              ),
            ),
            handle: {
              tracking: {
                pageName: wizardPageName,
                pageType: PageType.funnel,
              },
            },
          },
          {
            id: 'stepId',
            path: urls.installationStep,
            ...lazyRouteConfig(() =>
              import('@/pages/installation/formStep/FormStep.page'),
            ),
            handle: {
              tracking: {
                pageName: wizardPageName,
                pageType: PageType.funnel,
              },
            },
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
