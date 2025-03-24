import NotFound from '../pages/404.page';

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();
      return {
        Component: moduleDefault,
        loader: moduleExports?.Loader,
        handle: {
          breadcrumb: moduleExports.breadcrumb,
        },
        ...moduleExports,
      };
    },
  };
};

export const COMMON_PATH = '/pci/projects';

export default [
  {
    path: '/pci/projects/:projectId/ai-ml',
    ...lazyRouteConfig(() => import('@/pages/Root.layout')),
    children: [
      {
        path: 'auth',
        id: 'auth',
        ...lazyRouteConfig(() => import('@/pages/auth/Auth.page')),
      },
      {
        path: 'dashboard',
        id: 'dashboard',
        ...lazyRouteConfig(() => import('@/pages/dashboard/Dashboard.layout')),
        children: [
          {
            path: '',
            id: 'dashboard.home',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/home/Home.page'),
            ),
          },
          {
            path: 'users',
            id: 'dashboard.users',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/users/Users.page'),
            ),
            children: [
              {
                id: 'dashboard.users.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/users/_components/AddUser.modal'),
                ),
              },
            ],
          },
          {
            path: 'tokens',
            id: 'dashboard.tokens',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/tokens/Tokens.page'),
            ),
            children: [
              {
                path: 'add',
                id: 'dashboard.token.add',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/tokens/_components/AddToken.modal'),
                ),
              },
              {
                path: 'delete/:tokenId',
                id: 'dashboard.tokens.delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/tokens/_components/DeleteToken.modal'
                  ),
                ),
              },
              {
                path: 'renew/:tokenId',
                id: 'dashboard.tokens.renew',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/tokens/_components/RenewToken.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'docker-registries',
            id: 'dashboard.docker-registries',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/docker/Docker.page'),
            ),
            children: [
              {
                path: 'add',
                id: 'dashboard.docker-registries.add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/docker/_components/privateDocker/_components/AddDocker.modal'
                  ),
                ),
              },
              {
                path: 'delete/:dockerId',
                id: 'dashboard.docker-registries.delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/docker/_components/privateDocker/_components/DeleteDocker.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'git-registries',
            id: 'dashboard.git-registries',
            ...lazyRouteConfig(() => import('@/pages/dashboard/git/Git.page')),
            children: [
              {
                path: 'add',
                id: 'dashboard.git-registries.add',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/git/_components/AddGit.modal'),
                ),
              },
              {
                path: 'delete/:region/:alias',
                id: 'dashboard.git-registries.delete',
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/git/_components/DeleteGit.modal'),
                ),
              },
            ],
          },
          {
            path: 'datastore',
            id: 'dashboard.datastores',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/datastore/Datastore.page'),
            ),
            children: [
              {
                path: 'add',
                id: 'dashboard.datastores.add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/datastore/_components/AddDatastore.modal'
                  ),
                ),
              },
              {
                path: 'delete/:region/:alias',
                id: 'dashboard.datastores.delete',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/dashboard/datastore/_components/DeleteDatastore.modal'
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
    element: <NotFound />,
  },
];
