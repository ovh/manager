import { getProjectQuery } from '@/hooks/useProject';
import queryClient from '@/queryClient';

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
    path: '/pci/projects/:projectId/users',
    loader: async ({ params }) => {
      return queryClient.fetchQuery(getProjectQuery(params.projectId));
    },
    ...lazyRouteConfig(() => import('@/pages/Layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/index/Index')),
        children: [
          {
            path: 'delete',
            ...lazyRouteConfig(() => import('@/pages/RemoveUserPage')),
            children: [],
          },
          {
            path: 'openrc/download',
            ...lazyRouteConfig(() => import('@/pages/OpenStackDownloadPage')),
            children: [],
          },
          {
            path: 'rclone/download',
            ...lazyRouteConfig(() => import('@/pages/RcloneDownloadPage')),
            children: [],
          },
          {
            path: 'token/generate',
            ...lazyRouteConfig(() =>
              import('@/pages/GenerateOpenStackTokenPage'),
            ),
            children: [],
          },
          {
            path: 'edit',
            ...lazyRouteConfig(() => import('@/pages/EditRolesPage')),
            children: [],
          },
          {
            path: 'new',
            ...lazyRouteConfig(() => import('@/pages/add/Index')),
          },
          {
            path: 'onboarding',
            ...lazyRouteConfig(() => import('@/pages/OnBoardingPage')),
            children: [
              {
                path: 'new',
                ...lazyRouteConfig(() => import('@/pages/add/Index')),
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
