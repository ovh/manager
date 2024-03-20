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
    id: 'ssh',
    path: '/pci/projects/:projectId/ssh',
    loader: async ({ params }) => {
      return queryClient.fetchQuery(getProjectQuery(params.projectId));
    },
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/ListingPage')),
        children: [
          {
            path: 'add',
            ...lazyRouteConfig(() => import('@/pages/AddSshPage')),
          },
          {
            path: ':sshId/remove',
            ...lazyRouteConfig(() => import('@/pages/RemoveSshPage')),
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
