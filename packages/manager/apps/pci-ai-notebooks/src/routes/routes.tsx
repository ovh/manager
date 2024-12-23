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
            path: '',
            id: 'notebooks',
            ...lazyRouteConfig(() => import('@/pages/Root.page')),
            children: [
              {
                path: 'start/:notebookId',
                id: 'notebooks.start',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/start/Start.modal'),
                ),
              },
              {
                path: 'stop/:notebookId',
                id: 'notebooks.stop',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/stop/Stop.modal'),
                ),
              },
              {
                path: 'delete/:notebookId',
                id: 'notebooks.delete',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/delete/Delete.modal'),
                ),
              },
            ],
          },
          {
            path: 'onboarding',
            id: 'onboarding',
            ...lazyRouteConfig(() =>
              import('@/pages/notebooks/onboarding/Onboarding.page'),
            ),
          },
          {
            path: 'new',
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
            path: ':notebookId',
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
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
