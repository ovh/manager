import queryClient from '@/queryClient';
import { getProjectQuery } from '@/hooks/useProject';

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
    id: 'users',
    path: '/pci/projects/:projectId/public-ips',
    loader: async ({ params }) => {
      return queryClient.fetchQuery(getProjectQuery(params.projectId));
    },
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        children: [
          {
            path: 'floating-ips',
            ...lazyRouteConfig(() => import('@/pages/list')),
          },
          {
            path: 'additional-ips',
            ...lazyRouteConfig(() => import('@/pages/list')),
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
