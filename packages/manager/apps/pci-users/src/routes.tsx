import { getProjectQuery } from '@/api/hooks/useProject';
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

export interface RouteHandle {
  tracking?: string;
}

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
            ...lazyRouteConfig(() => import('@/pages/delete/RemoveUserPage')),
            children: [],
          },
          {
            path: 'openrc/download',
            ...lazyRouteConfig(() =>
              import('@/pages/openrc/download/OpenStackDownloadPage'),
            ),
            children: [],
            handle: {
              tracking: 'download-openrc',
            },
          },
          {
            path: 'rclone/download',
            ...lazyRouteConfig(() =>
              import('@/pages/rclone/download/RcloneDownloadPage'),
            ),
            children: [],
            handle: {
              tracking: 'download-rclone',
            },
          },
          {
            path: 'token/generate',
            ...lazyRouteConfig(() =>
              import('@/pages/token/generate/GenerateOpenStackTokenPage'),
            ),
            children: [],
            handle: {
              tracking: 'openstack-token',
            },
          },
          {
            path: 'edit',
            ...lazyRouteConfig(() => import('@/pages/edit/EditRolesPage')),
            children: [],
          },
          {
            path: 'new',
            ...lazyRouteConfig(() => import('@/pages/add/Index')),
          },
        ],
      },
      {
        path: 'onboarding',
        ...lazyRouteConfig(() => import('@/pages/onboarding/OnBoardingPage')),
        children: [
          {
            path: 'new',
            ...lazyRouteConfig(() => import('@/pages/add/Index')),
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
