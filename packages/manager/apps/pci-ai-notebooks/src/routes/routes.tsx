import ErrorBoundary from '@/components/error-boundary/ErrorBoundary.component';
import NotFound from '@/pages/404.page';

const lazyRouteConfig = (importFn: CallableFunction) => {
  return {
    lazy: async () => {
      const { default: moduleDefault, ...moduleExports } = await importFn();
      return {
        Component: moduleDefault,
        loader: moduleExports?.Loader,
        ErrorBoundary,
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
    path: '/pci/projects/:projectId/ai/notebooks',
    ...lazyRouteConfig(() => import('@/pages/Root.layout')),
    children: [
      {
        path: 'auth',
        id: 'auth',
        ...lazyRouteConfig(() => import('@/pages/notebooks/auth/Auth.page')),
      },
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/Auth.layout')),
        children: [
          {
            path: 'notebooks',
            id: 'notebooks',
            ...lazyRouteConfig(() =>
              import('@/pages/notebooks/NotebookRoot.page'),
            ),
            children: [
              {
                path: 'notebooks/start/:notebookId',
                id: 'notebooks.start',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/start/Start.modal'),
                ),
              },
              {
                path: 'notebooks/stop/:notebookId',
                id: 'notebooks.stop',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/stop/Stop.modal'),
                ),
              },
              {
                path: 'notebooks/delete/:notebookId',
                id: 'notebooks.delete',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/delete/Delete.modal'),
                ),
              },
            ],
          },
          {
            path: 'notebooks/onboarding',
            id: 'onboarding',
            ...lazyRouteConfig(() =>
              import('@/pages/notebooks/onboarding/Onboarding.page'),
            ),
          },
          {
            path: 'notebooks/new',
            id: 'create',
            ...lazyRouteConfig(() =>
              import('@/pages/notebooks/create/Create.page'),
            ),
            children: [
              {
                path: 'add-sshkey',
                id: 'create.add-sshkey',
                ...lazyRouteConfig(() =>
                  import('@/pages/_components/sshkey/AddSSHKey.modal'),
                ),
              },
            ],
          },
          {
            path: 'notebooks/:notebookId',
            ...lazyRouteConfig(() =>
              import('@/pages/notebooks/[notebookId]/Notebook.layout'),
            ),
            children: [
              {
                path: '',
                id: 'notebook.dashboard',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/notebooks/[notebookId]/dashboard/Dashboard.page'
                  ),
                ),
                children: [
                  {
                    path: 'delete',
                    id: 'notebook.dashboard.delete',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/dashboard/delete/Delete.modal'
                      ),
                    ),
                  },
                ],
              },
              {
                path: 'containers',
                id: 'notebook.containers',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/notebooks/[notebookId]/containers/Containers.page'
                  ),
                ),
                children: [
                  {
                    path: 'data-sync',
                    id: 'notebook.attach-data.data-sync',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/containers/dataSync/DataSync.modal'
                      ),
                    ),
                  },
                  {
                    path: 'data-sync/:volumeId?',
                    id: 'notebook.attach-data.data-sync.volume',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/containers/dataSync/DataSync.modal'
                      ),
                    ),
                  },
                ],
              },
              {
                path: 'public-git',
                id: 'notebook.public-git',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/notebooks/[notebookId]/public-git/PublicGit.page'
                  ),
                ),
              },
              {
                path: 'logs',
                id: 'notebook.logs',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/[notebookId]/logs/Logs.page'),
                ),
              },
              {
                path: 'backups',
                id: 'notebook.backups',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/[notebookId]/backups/Backups.page'),
                ),
                children: [
                  {
                    path: 'fork/:backupId?',
                    id: 'notebook.notebook.backups.fork',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/backups/fork/Fork.modal'
                      ),
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: 'dashboard',
            ...lazyRouteConfig(() =>
              import('@/pages/dashboard/Dashboard.layout'),
            ),
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
                      import(
                        '@/pages/dashboard/users/_components/AddUser.modal'
                      ),
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
                      import(
                        '@/pages/dashboard/tokens/_components/AddToken.modal'
                      ),
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
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/git/Git.page'),
                ),
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
                      import(
                        '@/pages/dashboard/git/_components/DeleteGit.modal'
                      ),
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
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
