import { getProjectQuery } from '@ovh-ux/manager-pci-common';
import queryClient from '@/queryClient';

const lazyRouteConfig = (importFn: CallableFunction) => ({
  lazy: async () => {
    const { default: moduleDefault, ...moduleExports } = await importFn();

    return {
      Component: moduleDefault,
      ...moduleExports,
    };
  },
});

export default [
  {
    path: '/',
    ...lazyRouteConfig(() => import('@/pages/Layout')),
  },
  {
    id: 'ssh',
    path: '/pci/projects/:projectId/ssh',
    loader: async ({ params }) =>
      queryClient.fetchQuery(getProjectQuery(params.projectId)),
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
