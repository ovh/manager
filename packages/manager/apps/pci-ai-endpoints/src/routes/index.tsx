import { PageType } from '@ovh-ux/manager-react-shell-client';
import NotFound from '@/pages/404.page';

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

export const COMMON_PATH = '/pci/projects';

export enum Route {
  Dashboard = 'dashboard',
  Onboarding = 'onboarding',
  Metrics = 'metrics',
  Token = 'token',
}

export default [
  {
    path: '/pci/projects/:projectId/ai/endpoints',
    ...lazyRouteConfig(() => import('@/pages/layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/onboarding.page')),
        handle: {
          tracking: {
            pageName: Route.Onboarding,
            pageType: PageType.onboarding,
          },
        },
      },
      {
        path: 'metrics',
        ...lazyRouteConfig(() => import('@/pages/metrics.page')),
        handle: {
          tracking: {
            pageName: Route.Metrics,
          },
        },
      },
      {
        path: 'token',
        ...lazyRouteConfig(() => import('@/pages/token.page')),
        handle: {
          tracking: {
            pageName: Route.Metrics,
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
