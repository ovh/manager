import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import NotFound from '../pages/404.page';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary.component';

const isQuantumPath = () => {
  if (typeof window === 'undefined') return false;
  const path = `${window.location.pathname ?? ''}${window.location.hash ??
    ''}`.toLowerCase();
  return path.includes('/quantum/');
};

const notebooksOnboardingTracking = {
  get id() {
    return isQuantumPath()
      ? 'emulators.emulators.onboarding'
      : 'ai_notebooks.onboarding';
  },
  category: 'onboarding',
};
const notebooksListingTracking = {
  get id() {
    return isQuantumPath()
      ? 'emulators.emulators.listing'
      : 'ai_notebooks.listing';
  },
  category: 'listing',
};
const notebooksCreateTracking = {
  get id() {
    return isQuantumPath()
      ? 'emulators.funnel.create_notebook'
      : 'ai_notebooks.funnel.create_ai_notebook';
  },
  category: 'funnel',
};
const notebooksAddSshKeyTracking = {
  get id() {
    return isQuantumPath()
      ? 'emulators.emulators.popup.configure_ssh-key'
      : 'ai_notebooks.funnel.popup.add-sshkey';
  },
  category: 'funnel',
};
const notebooksStartTracking = {
  get id() {
    return isQuantumPath()
      ? 'emulators.emulators.popup.start'
      : 'ai_notebooks.popup.start';
  },
  category: 'listing',
};
const notebooksStopTracking = {
  get id() {
    return isQuantumPath()
      ? 'emulators.emulators.popup.stop'
      : 'ai_notebooks.popup.stop';
  },
  category: 'listing',
};
const notebooksDeleteTracking = {
  get id() {
    return isQuantumPath()
      ? 'emulators.emulators.popup.delete'
      : 'ai_notebooks.popup.delete';
  },
  category: 'listing',
};
const qpusListingTracking = {
  get id() {
    return 'qpus.qpus.listing';
  },
  category: 'listing',
};
const qpusStartTracking = {
  get id() {
    return 'qpus.qpus.popup.start';
  },
  category: 'listing',
};
const qpusStopTracking = {
  get id() {
    return 'qpus.qpus.popup.stop';
  },
  category: 'listing',
};
const qpusDeleteTracking = {
  get id() {
    return 'qpus.qpus.popup.delete';
  },
  category: 'listing',
};
const qpusOnboardingTracking = {
  get id() {
    return 'qpus.qpus.onboarding';
  },
  category: 'onboarding',
};
const qpusCreateTracking = {
  get id() {
    return 'qpus.qpus.funnel.create_notebook';
  },
  category: 'funnel',
};
const qpusAddSshKeyTracking = {
  get id() {
    return 'qpus.qpus.popup.configure_ssh-key';
  },
  category: 'funnel',
};

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
                handle: {
                  tracking: {
                    id: 'ai_dashboard.home',
                    category: 'dashboard',
                  },
                },
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/home/Home.page'),
                ),
              },
              {
                path: 'users',
                id: 'dashboard.users',
                handle: {
                  tracking: {
                    id: 'ai_dashboard.users',
                    category: 'dashboard',
                  },
                },
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/users/Users.page'),
                ),
                children: [
                  {
                    id: 'dashboard.users.add',
                    path: 'add',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.users.popup.add',
                        category: 'dashboard',
                      },
                    },
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
                handle: {
                  tracking: {
                    id: 'ai_dashboard.tokens',
                    category: 'dashboard',
                  },
                },
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/tokens/Tokens.page'),
                ),
                children: [
                  {
                    path: 'add',
                    id: 'dashboard.token.add',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.token.popup.add',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/tokens/_components/AddToken.modal'
                      ),
                    ),
                  },
                  {
                    path: 'delete/:tokenId',
                    id: 'dashboard.tokens.delete',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.tokens.popup.delete',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/tokens/_components/DeleteToken.modal'
                      ),
                    ),
                  },
                  {
                    path: 'renew/:tokenId',
                    id: 'dashboard.tokens.renew',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.tokens.popup.renew',
                        category: 'dashboard',
                      },
                    },
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
                handle: {
                  tracking: {
                    id: 'ai_dashboard.docker-registries',
                    category: 'dashboard',
                  },
                },
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/docker/Docker.page'),
                ),
                children: [
                  {
                    path: 'add',
                    id: 'dashboard.docker-registries.add',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.docker-registries.popup.add',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/docker/_components/privateDocker/_components/AddDocker.modal'
                      ),
                    ),
                  },
                  {
                    path: 'delete/:dockerId',
                    id: 'dashboard.docker-registries.delete',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.docker-registries.popup.delete',
                        category: 'dashboard',
                      },
                    },
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
                handle: {
                  tracking: {
                    id: 'ai_dashboard.git-registries',
                    category: 'dashboard',
                  },
                },
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/git/Git.page'),
                ),
                children: [
                  {
                    path: 'add',
                    id: 'dashboard.git-registries.add',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.git-registries.popup.add',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/dashboard/git/_components/AddGit.modal'),
                    ),
                  },
                  {
                    path: 'delete/:region/:alias',
                    id: 'dashboard.git-registries.delete',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.git-registries.popup.delete',
                        category: 'dashboard',
                      },
                    },
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
                handle: {
                  tracking: {
                    id: 'ai_dashboard.datastores',
                    category: 'dashboard',
                  },
                },
                ...lazyRouteConfig(() =>
                  import('@/pages/dashboard/datastore/Datastore.page'),
                ),
                children: [
                  {
                    path: 'add',
                    id: 'dashboard.datastores.add',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.datastores.popup.add',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/dashboard/datastore/_components/AddDatastore.modal'
                      ),
                    ),
                  },
                  {
                    path: 'delete/:region/:alias',
                    id: 'dashboard.datastores.delete',
                    handle: {
                      tracking: {
                        id: 'ai_dashboard.datastores.popup.delete',
                        category: 'dashboard',
                      },
                    },
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
                handle: {
                  tracking: notebooksListingTracking,
                },
                ...lazyRouteConfig(() =>
                  import('@/pages/notebooks/Notebooks.page'),
                ),
                children: [
                  {
                    path: 'start/:notebookId',
                    id: 'notebooks.start',
                    handle: {
                      tracking: notebooksStartTracking,
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/start/Start.modal'),
                    ),
                  },
                  {
                    path: 'restart/:notebookId',
                    id: 'notebooks.restart',
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.popup.restart',
                        category: 'listing',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/restart/Restart.modal'),
                    ),
                  },
                  {
                    path: 'stop/:notebookId',
                    id: 'notebooks.stop',
                    handle: {
                      tracking: notebooksStopTracking,
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/stop/Stop.modal'),
                    ),
                  },
                  {
                    path: 'delete/:notebookId',
                    id: 'notebooks.delete',
                    handle: {
                      tracking: notebooksDeleteTracking,
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/delete/Delete.modal'),
                    ),
                  },
                ],
              },
              {
                path: 'onboarding',
                id: 'onboarding-notebooks',
                handle: {
                  tracking: notebooksOnboardingTracking,
                },
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
                handle: {
                  tracking: notebooksCreateTracking,
                  breadcrumb: () => (
                    <BreadcrumbItem
                      translationKey="breadcrumb"
                      namespace="ai-tools/notebooks/create"
                    />
                  ),
                },
                children: [
                  {
                    path: 'add-sshkey',
                    id: 'notebooks.create.add-sshkey',
                    handle: {
                      tracking: notebooksAddSshKeyTracking,
                    },
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
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.notebook.dashboard',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/dashboard/Dashboard.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'delete',
                        id: 'notebooks.notebook.dashboard.delete',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.notebook.dashboard.popup.delete',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/dashboard/delete/Delete.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-flavor',
                        id: 'notebooks.notebook.dashboard.update-flavor',
                        handle: {
                          tracking: {
                            id:
                              'ai_notebooks.notebook.dashboard.popup.update-flavor',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/dashboard/_components/update-flavor/UpdateFlavor.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-auto-restart',
                        id: 'notebooks.notebook.dashboard.update-auto-restart',
                        handle: {
                          tracking: {
                            id:
                              'ai_notebooks.notebook.dashboard.popup.update-auto-restart',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/components/auto-restart/UpdateAutorestart.modal'
                          ),
                        ),
                      },
                    ],
                  },
                  {
                    path: 'containers',
                    id: 'notebooks.notebook.containers',
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.notebook.containers',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/containers/Containers.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'data-sync',
                        id: 'notebooks.notebook.containers.data-sync',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.notebook.containers.data-sync',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/containers/dataSync/DataSync.modal'
                          ),
                        ),
                      },
                      {
                        path: 'add-container',
                        id: 'notebooks.notebook.container.add',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.notebook.container.popup.add',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/containers/addVolume/AddVolume.modal'
                          ),
                        ),
                      },
                      {
                        path: 'delete/:volumeId?',
                        id: 'notebooks.notebook.container.delete',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.notebook.container.popup.delete',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/containers/deleteVolume/DeleteVolume.modal'
                          ),
                        ),
                      },
                      {
                        path: 'data-sync/:volumeId?',
                        id: 'notebooks.notebook.containers.data-sync.volume',
                        handle: {
                          tracking: {
                            id:
                              'ai_notebooks.notebook.containers.data-sync.volume',
                            category: 'dashboard',
                          },
                        },
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
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.notebook.public-git',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/public-git/PublicGit.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'add-public-git',
                        id: 'notebooks.notebook.public-git.add',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.notebook.public-git.popup.add',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/public-git/addVolume/AddVolume.modal'
                          ),
                        ),
                      },
                      {
                        path: 'delete/:volumeId?',
                        id: 'notebooks.notebook.public-git.delete',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.notebook.public-git.popup.delete',
                            category: 'dashboard',
                          },
                        },
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
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.notebook.logs',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/[notebookId]/logs/Logs.page'),
                    ),
                  },
                  {
                    path: 'backups',
                    id: 'notebooks.notebook.backups',
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.notebook.backups',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/backups/Backups.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'fork/:backupId?',
                        id: 'notebooks.notebook.backups.fork',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.notebook.backups.popup.fork',
                            category: 'dashboard',
                          },
                        },
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
                handle: {
                  tracking: {
                    id: 'ai_training.listing',
                    category: 'listing',
                  },
                },
                ...lazyRouteConfig(() => import('@/pages/jobs/Jobs.page')),
                children: [
                  {
                    path: 'restart/:jobId',
                    id: 'training.restart',
                    handle: {
                      tracking: {
                        id: 'ai_training.popup.restart',
                        category: 'listing',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/restart/Restart.modal'),
                    ),
                  },
                  {
                    path: 'stop/:jobId',
                    id: 'training.stop',
                    handle: {
                      tracking: {
                        id: 'ai_training.popup.stop',
                        category: 'listing',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/kill/Kill.modal'),
                    ),
                  },
                  {
                    path: 'delete/:jobId',
                    id: 'training.delete',
                    handle: {
                      tracking: {
                        id: 'ai_training.popup.delete',
                        category: 'listing',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/delete/Delete.modal'),
                    ),
                  },
                ],
              },
              {
                path: 'onboarding',
                id: 'onboarding-training',
                handle: {
                  tracking: {
                    id: 'ai_training.onboarding',
                    category: 'onboarding',
                  },
                },
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
                handle: {
                  tracking: {
                    id: 'ai_training.funnel.create_ai_training',
                    category: 'funnel',
                  },
                  breadcrumb: () => (
                    <BreadcrumbItem
                      translationKey={`breadcrumb`}
                      namespace="ai-tools/jobs/create"
                    />
                  ),
                },
                children: [
                  {
                    path: 'add-sshkey',
                    id: 'training.create.add-sshkey',
                    handle: {
                      tracking: {
                        id: 'ai_training.funnel.popup.add-sshkey',
                        category: 'funnel',
                      },
                    },
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
                    handle: {
                      tracking: {
                        id: 'ai_training.job.dashboard',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/[jobId]/dashboard/Dashboard.page'),
                    ),
                    children: [
                      {
                        path: 'delete',
                        id: 'training.job.dashboard.delete',
                        handle: {
                          tracking: {
                            id: 'ai_training.job.dashboard.popup.delete',
                            category: 'dashboard',
                          },
                        },
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
                    handle: {
                      tracking: {
                        id: 'ai_training.job.containers',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/[jobId]/containers/Containers.page'),
                    ),
                    children: [
                      {
                        path: 'data-sync',
                        id: 'training.job.containers.data-sync',
                        handle: {
                          tracking: {
                            id: 'ai_training.job.containers.data-sync',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/jobs/[jobId]/containers/dataSync/DataSync.modal'
                          ),
                        ),
                      },
                      {
                        path: 'data-sync/:volumeId?',
                        id: 'training.job.containers.data-sync.volume',
                        handle: {
                          tracking: {
                            id: 'ai_training.job.containers.data-sync.volume',
                            category: 'dashboard',
                          },
                        },
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
                    handle: {
                      tracking: {
                        id: 'ai_training.job.public-git',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/jobs/[jobId]/public-git/PublicGit.page'),
                    ),
                  },
                  {
                    path: 'logs',
                    id: 'training.job.logs',
                    handle: {
                      tracking: {
                        id: 'ai_training.job.logs',
                        category: 'dashboard',
                      },
                    },
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
                handle: {
                  tracking: {
                    id: 'ai_deploy.listing',
                    category: 'listing',
                  },
                },
                ...lazyRouteConfig(() => import('@/pages/apps/Apps.page')),
                children: [
                  {
                    path: 'start/:appId',
                    id: 'deploy.start',
                    handle: {
                      tracking: {
                        id: 'ai_deploy.popup.start',
                        category: 'listing',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/start/Start.modal'),
                    ),
                  },
                  {
                    path: 'stop/:appId',
                    id: 'deploy.stop',
                    handle: {
                      tracking: {
                        id: 'ai_deploy.popup.stop',
                        category: 'listing',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/stop/Stop.modal'),
                    ),
                  },
                  {
                    path: 'delete/:appId',
                    id: 'deploy.delete',
                    handle: {
                      tracking: {
                        id: 'ai_deploy.popup.delete',
                        category: 'listing',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/delete/Delete.modal'),
                    ),
                  },
                ],
              },
              {
                path: 'onboarding',
                id: 'onboarding-deploy',
                handle: {
                  tracking: {
                    id: 'ai_deploy.onboarding',
                    category: 'onboarding',
                  },
                },
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
                handle: {
                  tracking: {
                    id: 'ai_deploy.funnel.create_deploy',
                    category: 'funnel',
                  },
                  breadcrumb: () => (
                    <BreadcrumbItem
                      translationKey={`breadcrumb`}
                      namespace="ai-tools/apps/create"
                    />
                  ),
                },
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
                    handle: {
                      tracking: {
                        id: 'ai_deploy.app.dashboard',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/[appId]/dashboard/Dashboard.page'),
                    ),
                    children: [
                      {
                        path: 'delete',
                        id: 'deploy.dashboard.delete',
                        handle: {
                          tracking: {
                            id: 'ai_deploy.app.dashboard.popup.delete',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/delete/Delete.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-port',
                        id: 'deploy.app.dashboard.update-port',
                        handle: {
                          tracking: {
                            id: 'ai_deploy.app.dashboard.popup.update-port',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/_components/update-port/UpdateHttpPort.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-image',
                        id: 'deploy.app.dashboard.update-image',
                        handle: {
                          tracking: {
                            id: 'ai_deploy.app.dashboard.popup.update-image',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/_components/update-image/UpdateCustomImage.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-scaling',
                        id: 'deploy.app.dashboard.update-scaling',
                        handle: {
                          tracking: {
                            id: 'ai_deploy.app.dashboard.popup.update-scaling',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/_components/update-scaling/UpdateScaling.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-flavor',
                        id: 'deploy.app.dashboard.update-flavor',
                        handle: {
                          tracking: {
                            id: 'ai_deploy.app.dashboard.popup.update-flavor',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/dashboard/_components/update-flavor/UpdateFlavor.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-docker-command',
                        id: 'deploy.app.dashboard.update-docker-command',
                        handle: {
                          tracking: {
                            id:
                              'ai_deploy.app.dashboard.popup.update-docker-command',
                            category: 'dashboard',
                          },
                        },
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
                    handle: {
                      tracking: {
                        id: 'ai_deploy.app.containers',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/[appId]/containers/Containers.page'),
                    ),
                    children: [
                      {
                        path: 'data-sync',
                        id: 'deploy.app.containers.data-sync',
                        handle: {
                          tracking: {
                            id: 'ai_deploy.app.containers.data-sync',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/apps/[appId]/containers/dataSync/DataSync.modal'
                          ),
                        ),
                      },
                      {
                        path: 'data-sync/:volumeId?',
                        id: 'deploy.app.containers.data-sync.volume',
                        handle: {
                          tracking: {
                            id: 'ai_deploy.app.containers.data-sync.volume',
                            category: 'dashboard',
                          },
                        },
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
                    handle: {
                      tracking: {
                        id: 'ai_deploy.app.public-git',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/[appId]/public-git/PublicGit.page'),
                    ),
                  },
                  {
                    path: 'logs',
                    id: 'deploy.app.logs',
                    handle: {
                      tracking: {
                        id: 'ai_deploy.app.logs',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/apps/[appId]/logs/Logs.page'),
                    ),
                  },
                ],
              },
            ],
          },

          {
            path: ':quantum/qpu',
            ...lazyRouteConfig(() => import('@/pages/qpus/QpuRoot.layout')),
            children: [
              {
                path: '',
                id: 'qpu',
                handle: {
                  tracking: qpusListingTracking,
                },
                ...lazyRouteConfig(() => import('@/pages/qpus/Qpu.page')),
                children: [
                  {
                    path: 'start/:notebookId',
                    id: 'qpusNotebooks.start',
                    handle: {
                      tracking: qpusStartTracking,
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/start/Start.modal'),
                    ),
                  },
                  {
                    path: 'restart/:notebookId',
                    id: 'qpusNotebooks.restart',
                    handle: {
                      tracking: {
                        id: 'qpus_ai_notebooks.popup.restart',
                        category: 'listing',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/restart/Restart.modal'),
                    ),
                  },
                  {
                    path: 'stop/:notebookId',
                    id: 'qpusNotebooks.stop',
                    handle: {
                      tracking: qpusStopTracking,
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/stop/Stop.modal'),
                    ),
                  },
                  {
                    path: 'delete/:notebookId',
                    id: 'qpusNotebooks.delete',
                    handle: {
                      tracking: qpusDeleteTracking,
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/delete/Delete.modal'),
                    ),
                  },
                ],
              },

              {
                path: 'onboarding',
                id: 'onboarding-qpu',
                handle: {
                  tracking: qpusOnboardingTracking,
                },
                ...lazyRouteConfig(() =>
                  import('@/pages/qpus/onboarding/Onboarding.page'),
                ),
              },

              {
                path: 'new',
                id: 'qpu.create',
                ...lazyRouteConfig(() =>
                  import('@/pages/qpus/create/Create.page'),
                ),
                handle: {
                  tracking: qpusCreateTracking,
                  breadcrumb: () => (
                    <BreadcrumbItem
                      translationKey="breadcrumb"
                      namespace="ai-tools/qpu/create"
                    />
                  ),
                },
                children: [
                  {
                    path: 'add-sshkey',
                    id: 'qpu.create.add-sshkey',
                    handle: {
                      tracking: qpusAddSshKeyTracking,
                    },
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
                    id: 'notebooks.qpus.dashboard',
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.qpus.dashboard',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/dashboard/Dashboard.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'delete',
                        id: 'notebooks.qpus.dashboard.delete',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.qpus.dashboard.popup.delete',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/dashboard/delete/Delete.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-flavor',
                        id: 'notebooks.qpus.dashboard.update-flavor',
                        handle: {
                          tracking: {
                            id:
                              'ai_notebooks.qpus.dashboard.popup.update-flavor',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/dashboard/_components/update-flavor/UpdateFlavor.modal'
                          ),
                        ),
                      },
                      {
                        path: 'update-auto-restart',
                        id: 'ai_notebooks.qpus.dashboard.update-auto-restart',
                        handle: {
                          tracking: {
                            id:
                              'ai_notebooks.qpus.dashboard.popup.update-auto-restart',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/components/auto-restart/UpdateAutorestart.modal'
                          ),
                        ),
                      },
                    ],
                  },
                  {
                    path: 'containers',
                    id: 'notebooks.qpus.containers',
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.qpus.containers',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/containers/Containers.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'data-sync',
                        id: 'notebooks.qpus.containers.data-sync',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.qpus.containers.data-sync',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/containers/dataSync/DataSync.modal'
                          ),
                        ),
                      },
                      {
                        path: 'add-container',
                        id: 'notebooks.qpus.container.add',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.qpus.container.popup.add',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/containers/addVolume/AddVolume.modal'
                          ),
                        ),
                      },
                      {
                        path: 'delete/:volumeId?',
                        id: 'notebooks.qpus.container.delete',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.qpus.container.popup.delete',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/containers/deleteVolume/DeleteVolume.modal'
                          ),
                        ),
                      },
                      {
                        path: 'data-sync/:volumeId?',
                        id: 'notebooks.qpus.containers.data-sync.volume',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.qpus.containers.data-sync.volume',
                            category: 'dashboard',
                          },
                        },
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
                    id: 'notebooks.qpus.public-git',
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.qpus.public-git',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/public-git/PublicGit.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'add-public-git',
                        id: 'notebooks.qpus.public-git.add',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.qpus.public-git.popup.add',
                            category: 'dashboard',
                          },
                        },
                        ...lazyRouteConfig(() =>
                          import(
                            '@/pages/notebooks/[notebookId]/public-git/addVolume/AddVolume.modal'
                          ),
                        ),
                      },
                      {
                        path: 'delete/:volumeId?',
                        id: 'notebooks.qpus.public-git.delete',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.qpus.public-git.popup.delete',
                            category: 'dashboard',
                          },
                        },
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
                    id: 'notebooks.qpus.logs',
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.qpus.logs',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import('@/pages/notebooks/[notebookId]/logs/Logs.page'),
                    ),
                  },
                  {
                    path: 'backups',
                    id: 'notebooks.qpus.backups',
                    handle: {
                      tracking: {
                        id: 'ai_notebooks.qpus.backups',
                        category: 'dashboard',
                      },
                    },
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/notebooks/[notebookId]/backups/Backups.page'
                      ),
                    ),
                    children: [
                      {
                        path: 'fork/:backupId?',
                        id: 'notebooks.qpus.backups.fork',
                        handle: {
                          tracking: {
                            id: 'ai_notebooks.qpus.backups.popup.fork',
                            category: 'dashboard',
                          },
                        },
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
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];
