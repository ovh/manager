import queryClient from '@/queryClient';
import { getProjectQuery } from '@/api/hooks/useProject';

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
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'public-ips',
    path: '/pci/projects/:projectId/public-ips',
    loader: async ({ params }) => {
      return queryClient.fetchQuery(getProjectQuery(params.projectId));
    },
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/list')),
        children: [
          {
            path: 'floating-ips',
            children: [
              {
                path: ':ipId/terminate',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/floating-ips/terminate/TerminateFloatingIPPage'
                  ),
                ),
              },
            ],
          },
          {
            path: 'additional-ips',
            children: [
              {
                path: ':ipId/terminate',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/additional-ips/terminate/TerminateAdditionalIPPage'
                  ),
                ),
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <>Not found page</>,
  },
];
