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
    id: 'rootlayout',
    ...lazyRouteConfig(() => import('@/pages/Root.layout')),
    children: [
      {
        path: '',
        ...lazyRouteConfig(() => import('@/pages/Root.page')),
      },
      {
        path: 'auth',
        id: 'auth',
        ...lazyRouteConfig(() => import('@/pages/auth-ai/Auth.page')),
      },
      {
        path: 'quantum/auth',
        id: 'quantum-auth',
        ...lazyRouteConfig(() => import('@/pages/auth-quantum/Auth.page')),
      },
      {
        path: '',
        id: 'authlayout',
        ...lazyRouteConfig(() => import('@/pages/Auth.layout')),
        children: [
          {
            path: 'dashboard',
            id: 'dashboard',
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
          {
            path: ':quantum?/notebooks',
            ...lazyRouteConfig(() =>
              import('@/pages/notebooks/NotebookRoot.layout'),
            ),
            children: [
              {
                path: '',
                id: 'notebooks',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/Notebooks.page'),
                ),
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
                id: 'onboarding-notebooks',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/onboarding/Onboarding.page'),
                ),
              },
              {
                path: 'new',
                id: 'notebooks.create',
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/create/Create.page'),
                ),
                children: [
                  {
                    path: 'add-sshkey',
                    id: 'notebooks.create.add-sshkey',
                    ...lazyRouteConfig(() =>
                      import('@/pages/_components/AddSSHKey.modal'),
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
                    id: 'notebooks.notebook.dashboard',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/dashboard/Dashboard.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'delete',
                        id: 'notebooks.notebook.dashboard.delete',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/dashboard/delete/Delete.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-flavor',
                        id: 'notebooks.notebook.dashboard.update-flavor',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/dashboard/_components/update-flavor/UpdateFlavor.modal'
                          ),
                        ),
                      },
                    ],
                  },
                  {
                    path: 'containers',
                    id: 'notebooks.notebook.containers',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/containers/Containers.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'data-sync',
                        id: 'notebooks.notebook.containers.data-sync',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/containers/dataSync/DataSync.modal'
                          ),
                        ),
                      },
                      {
                        path: 'add-container',
                        id: 'notebooks.notebook.container.add',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/containers/addVolume/AddVolume.modal'
                          ),
                        ),
                      },
                      {
                        path: 'delete/:volumeId?',
                        id: 'notebooks.notebook.container.delete',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/containers/deleteVolume/DeleteVolume.modal'
                          ),
                        ),
                      },
                      {
                        path: 'data-sync/:volumeId?',
                        id: 'notebooks.notebook.containers.data-sync.volume',
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
                    id: 'notebooks.notebook.public-git',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/public-git/PublicGit.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'add-public-git',
                        id: 'notebooks.notebook.public-git.add',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/public-git/addVolume/AddVolume.modal'
                          ),
                        ),
                      },
                      {
                        path: 'delete/:volumeId?',
                        id: 'notebooks.notebook.public-git.delete',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/public-git/deleteVolume/DeleteVolume.modal'
                          ),
                        ),
                      },
                    ],
                  },
                  {
                    path: 'logs',
                    id: 'notebooks.notebook.logs',
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/[notebookId]/logs/Logs.page'),
                    ),
                  },
                  {
                    path: 'backups',
                    id: 'notebooks.notebook.backups',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/backups/Backups.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'fork/:backupId?',
                        id: 'notebooks.notebook.backups.fork',
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
          {
            path: 'training',
            ...lazyRouteConfig(() => import('@/pages/jobs/JobRoot.layout')),
            children: [
              {
                path: '',
                id: 'training',
                ...lazyRouteConfig(() => import('@/pages/jobs/Jobs.page')),
                children: [
                  {
                    path: 'restart/:jobId',
                    id: 'training.restart',
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/restart/Restart.modal'),
                    ),
                  },
                  {
                    path: 'stop/:jobId',
                    id: 'training.stop',
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/kill/Kill.modal'),
                    ),
                  },
                  {
                    path: 'delete/:jobId',
                    id: 'training.delete',
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/delete/Delete.modal'),
                    ),
                  },
                ],
              },
              {
                path: 'onboarding',
                id: 'onboarding-training',
                ...lazyRouteConfig(() =>
                  import('@/pages/jobs/onboarding/Onboarding.page'),
                ),
              },
              {
                path: 'new',
                id: 'training.create',
                ...lazyRouteConfig(() =>
                  import('@/pages/jobs/create/Create.page'),
                ),
                children: [
                  {
                    path: 'add-sshkey',
                    id: 'training.create.add-sshkey',
                    ...lazyRouteConfig(() =>
                      import('@/pages/_components/AddSSHKey.modal'),
                    ),
                  },
                ],
              },
              {
                path: ':jobId',
                ...lazyRouteConfig(() =>
                  import('@/pages/jobs/[jobId]/Job.layout'),
                ),
                children: [
                  {
                    path: '',
                    id: 'training.job.dashboard',
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/[jobId]/dashboard/Dashboard.page'),
                    ),
                    children: [
                      {
                        path: 'delete',
                        id: 'training.job.dashboard.delete',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/jobs/[jobId]/dashboard/delete/Delete.modal'
                          ),
                        ),
                      },
                    ],
                  },
                  {
                    path: 'containers',
                    id: 'training.job.containers',
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/[jobId]/containers/Containers.page'),
                    ),
                    children: [
                      {
                        path: 'data-sync',
                        id: 'training.job.containers.data-sync',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/jobs/[jobId]/containers/dataSync/DataSync.modal'
                          ),
                        ),
                      },
                      {
                        path: 'data-sync/:volumeId?',
                        id: 'training.job.containers.data-sync.volume',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/jobs/[jobId]/containers/dataSync/DataSync.modal'
                          ),
                        ),
                      },
                    ],
                  },
                  {
                    path: 'public-git',
                    id: 'training.job.public-git',
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/[jobId]/public-git/PublicGit.page'),
                    ),
                  },
                  {
                    path: 'logs',
                    id: 'training.job.logs',
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/[jobId]/logs/Logs.page'),
                    ),
                  },
                ],
              },
            ],
          },
          {
            path: 'deploy',
            ...lazyRouteConfig(() => import('@/pages/apps/AppRoot.Layout')),
            children: [
              {
                path: '',
                id: 'deploy',
                ...lazyRouteConfig(() => import('@/pages/apps/Apps.page')),
                children: [
                  {
                    path: 'start/:appId',
                    id: 'deploy.start',
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/start/Start.modal'),
                    ),
                  },
                  {
                    path: 'stop/:appId',
                    id: 'deploy.stop',
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/stop/Stop.modal'),
                    ),
                  },
                  {
                    path: 'delete/:appId',
                    id: 'deploy.delete',
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/delete/Delete.modal'),
                    ),
                  },
                ],
              },
              {
                path: 'onboarding',
                id: 'onboarding-deploy',
                ...lazyRouteConfig(() =>
                  import('@/pages/apps/onboarding/Onboarding.page'),
                ),
              },
              {
                path: 'new',
                id: 'deploy.create',
                ...lazyRouteConfig(() =>
                  import('@/pages/apps/create/Create.page'),
                ),
              },
              {
                path: ':appId',
                ...lazyRouteConfig(() =>
                  import('@/pages/apps/[appId]/App.layout'),
                ),
                children: [
                  {
                    path: '',
                    id: 'deploy.app.dashboard',
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/[appId]/dashboard/Dashboard.page'),
                    ),
                    children: [
                      {
                        path: 'delete',
                        id: 'deploy.dashboard.delete',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/delete/Delete.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-port',
                        id: 'deploy.app.dashboard.update-port',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/_components/update-port/UpdateHttpPort.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-image',
                        id: 'deploy.app.dashboard.update-image',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/_components/update-image/UpdateCustomImage.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-scaling',
                        id: 'deploy.app.dashboard.update-scaling',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/_components/update-scaling/UpdateScaling.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-flavor',
                        id: 'deploy.app.dashboard.update-flavor',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/_components/update-flavor/UpdateFlavor.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-docker-command',
                        id: 'deploy.app.dashboard.update-docker-command',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/_components/update-docker-command/UpdateDockerCommand.modal'
                          ),
                        ),
                      },
                    ],
                  },
                  {
                    path: 'containers',
                    id: 'deploy.app.containers',
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/[appId]/containers/Containers.page'),
                    ),
                    children: [
                      {
                        path: 'data-sync',
                        id: 'deploy.app.containers.data-sync',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/containers/dataSync/DataSync.modal'
                          ),
                        ),
                      },
                      {
                        path: 'data-sync/:volumeId?',
                        id: 'deploy.app.containers.data-sync.volume',
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/containers/dataSync/DataSync.modal'
                          ),
                        ),
                      },
                    ],
                  },
                  {
                    path: 'public-git',
                    id: 'deploy.app.public-git',
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/[appId]/public-git/PublicGit.page'),
                    ),
                  },
                  {
                    path: 'logs',
                    id: 'deploy.app.logs',
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/[appId]/logs/Logs.page'),
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
