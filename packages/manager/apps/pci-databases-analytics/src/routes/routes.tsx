import NotFound from '../pages/404.page';
import ErrorBoundary from '../components/error-boundary/ErrorBoundary.component';

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
    path: '/pci/projects/:projectId/databases-analytics/:category/services',
    ...lazyRouteConfig(() => import('@/pages/Root.layout')),
    children: [
      {
        path: '',
        id: 'services',
        ...lazyRouteConfig(() => import('@/pages/Root.page')),
        children: [
          {
            path: 'delete/:serviceId',
            id: 'services.delete.{service.engine}',
            ...lazyRouteConfig(() =>
              import('@/pages/services/delete/Delete.modal'),
            ),
          },
          {
            path: 'rename/:serviceId',
            id: 'services.rename.{service.engine}',
            ...lazyRouteConfig(() =>
              import('@/pages/services/rename/Rename.modal'),
            ),
          },
        ],
      },
      {
        path: 'onboarding',
        id: 'onboarding',
        ...lazyRouteConfig(() =>
          import('@/pages/services/onboarding/Onboarding.page'),
        ),
      },
      {
        path: 'new',
        id: 'create',
        ...lazyRouteConfig(() => import('@/pages/services/create/Create.page')),
      },
      {
        path: ':serviceId',
        ...lazyRouteConfig(() =>
          import('@/pages/services/[serviceId]/Service.layout'),
        ),
        children: [
          {
            path: '',
            id: 'service.{service.engine}.dashboard',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/dashboard/Dashboard.page'),
            ),
          },
          {
            path: 'users',
            id: 'service.{service.engine}.users',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/users/Users.page'),
            ),
            children: [
              {
                id: 'service.{service.engine}.users.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/users/add/AddUser.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.users.edit',
                path: 'edit/:userId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/users/edit/EditUser.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.users.delete',
                path: 'delete/:userId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/users/delete/DeleteUser.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.users.reset-password',
                path: 'reset-password/:userId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/users/resetPassword/ResetPassword.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.users.view-certificates',
                path: 'view-certificates/:userId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/users/viewCertificates/ViewCertificates.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.users.show-access-key',
                path: 'show-access-key/:userId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/users/showAccessKey/ShowAccessKey.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'backups',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/backups/Backups.layout'),
            ),
            children: [
              {
                path: '',
                id: 'service.{service.engine}.backups',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/backups/Backups.page'),
                ),
                children: [
                  {
                    path: 'restore/:backupId?',
                    id: 'service.{service.engine}.backups.restore',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/backups/restore/Restore.modal'
                      ),
                    ),
                  },
                ],
              },
              {
                path: 'fork',
                id: 'service.{service.engine}.fork',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/backups/fork/Fork.page'),
                ),
              },
            ],
          },
          {
            path: 'databases',
            id: 'service.{service.engine}.databases',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/databases/Database.page'),
            ),
            children: [
              {
                id: 'service.{service.engine}.databases.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/databases/add/AddDatabase.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.databases.delete',
                path: 'delete/:databaseId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/databases/delete/DeleteDatabase.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'namespaces',
            id: 'service.{service.engine}.namespaces',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/namespaces/Namespace.page'),
            ),
            children: [
              {
                id: 'service.{service.engine}.namespaces.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/namespaces/add/AddNamespace.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.namespaces.edit',
                path: 'edit/:namespaceId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/namespaces/edit/EditNamespace.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.namespaces.delete',
                path: 'delete/:namespaceId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/namespaces/delete/DeleteNamespace.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'pools',
            id: 'service.{service.engine}.pools',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/pools/Pools.page'),
            ),
            children: [
              {
                id: 'service.{service.engine}.pools.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/pools/add/AddPool.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.pools.edit',
                path: 'edit/:poolId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/pools/edit/EditPool.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.pools.delete',
                path: 'delete/:poolId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/pools/delete/DeletePool.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.pools.informations',
                path: 'informations/:poolId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/pools/informations/InfoConnectionPool.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'queries',
            id: 'service.{service.engine}.queries',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/queries/Queries.page'),
            ),
          },
          {
            path: 'indexPatterns',
            id: 'service.{service.engine}.indexPatterns',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/services/[serviceId]/indexPatterns/IndexPatterns.page'
              ),
            ),
            children: [
              {
                id: 'service.{service.engine}.indexPatterns.addPattern',
                path: 'add-pattern',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/indexPatterns/addPattern/AddPattern.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.indexPatterns.deletePattern',
                path: 'delete-pattern/:patternId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/indexPatterns/deletePattern/DeletePattern.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.indexPatterns.deleteIndex',
                path: 'delete-index/:indexId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/indexPatterns/deleteIndex/DeleteIndex.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'connectors',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/services/[serviceId]/connectors/Connectors.layout'
              ),
            ),
            children: [
              {
                id: 'service.{service.engine}.connectors',
                path: '',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/connectors/Connectors.page'
                  ),
                ),
                children: [
                  {
                    id: 'service.{service.engine}.connectors.delete',
                    path: 'delete/:connectorId',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/connectors/delete/DeleteConnector.modal'
                      ),
                    ),
                  },
                ],
              },
              {
                id: 'service.{service.engine}.connectors.tasks',
                path: 'tasks/:connectorId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/connectors/tasks/Tasks.page'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.connectors.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/connectors/add/AddConnector.page'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.connectors.edit',
                path: 'edit/:connectorId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/connectors/edit/EditConnector.page'
                  ),
                ),
              },
            ],
          },
          {
            path: 'topics',
            id: 'service.{service.engine}.topics',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/topics/Topics.page'),
            ),
            children: [
              {
                id: 'service.{service.engine}.topics.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/topics/add/AddTopic.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.topics.edit',
                path: 'edit/:topicId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/topics/edit/EditTopic.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.topics.delete',
                path: 'delete/:topicId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/topics/delete/DeleteTopic.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'topicAcls',
            id: 'service.{service.engine}.topicAcls',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/topicAcls/TopicAcls.page'),
            ),
            children: [
              {
                id: 'service.{service.engine}.topicAcls.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/topicAcls/add/AddTopicAcl.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.topicAcls.delete',
                path: 'delete/:topicAclId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/topicAcls/delete/DeleteTopicAcl.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'integrations',
            id: 'service.{service.engine}.integrations',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/services/[serviceId]/integrations/Integrations.page'
              ),
            ),
            children: [
              {
                id: 'service.{service.engine}.integrations.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/integrations/add/AddIntegration.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.integrations.delete',
                path: 'delete/:integrationId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/integrations/delete/DeleteIntegration.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'replications',
            id: 'service.{service.engine}.replications',
            ...lazyRouteConfig(() =>
              import(
                '@/pages/services/[serviceId]/replications/Replications.page'
              ),
            ),
            children: [
              {
                id: 'service.{service.engine}.replications.add',
                path: 'add',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/replications/add/AddReplication.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.replications.edit',
                path: 'edit/:replicationId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/replications/edit/EditReplication.modal'
                  ),
                ),
              },
              {
                id: 'service.{service.engine}.replications.delete',
                path: 'delete/:replicationId',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/replications/delete/DeleteReplication.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'metrics',
            id: 'service.{service.engine}.metrics',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/metrics/Metrics.page'),
            ),
            children: [
              {
                id:
                  'service.{service.engine}.metrics.reset-prometheus-password',
                path: 'reset-prometheus-password',
                ...lazyRouteConfig(() =>
                  import(
                    '@/pages/services/[serviceId]/metrics/resetPrometheusPassword/ResetPrometheusPassword.modal'
                  ),
                ),
              },
            ],
          },
          {
            path: 'logs',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/logs/Logs.layout'),
            ),
            children: [
              {
                path: '',
                id: 'service.{service.engine}.logs',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/logs/Logs.page'),
                ),
              },
              {
                path: 'streams',
                id: 'service.{service.engine}.logs.streams',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/logs/Streams.page'),
                ),
              },
            ],
          },
          {
            path: 'settings',
            ...lazyRouteConfig(() =>
              import('@/pages/services/[serviceId]/settings/Settings.layout'),
            ),
            children: [
              {
                path: '',
                id: 'service.{service.engine}.settings',
                ...lazyRouteConfig(() =>
                  import('@/pages/services/[serviceId]/settings/Settings.page'),
                ),
                children: [
                  {
                    path: 'delete',
                    id: 'service.{service.engine}.settings.delete',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/settings/delete/Delete.modal'
                      ),
                    ),
                  },
                  {
                    path: 'rename',
                    id: 'service.{service.engine}.settings.rename',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/settings/rename/Rename.modal'
                      ),
                    ),
                  },
                  {
                    path: 'deletion-protection',
                    id: 'service.{service.engine}.settings.deletion-protection',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/settings/_components/deletionProtection/DeletionProtection.modal'
                      ),
                    ),
                  },
                  {
                    path: 'update-version',
                    id: 'service.{service.engine}.settings.update-version',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/settings/update/updateVersion/UpdateVersion.modal'
                      ),
                    ),
                  },
                  {
                    path: 'update-plan',
                    id: 'service.{service.engine}.settings.update-plan',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/settings/update/updatePlan/UpdatePlan.modal'
                      ),
                    ),
                  },
                  {
                    path: 'update-flavor',
                    id: 'service.{service.engine}.settings.update-flavor',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/settings/update/updateFlavor/UpdateFlavor.modal'
                      ),
                    ),
                  },
                  {
                    path: 'add-node',
                    id: 'service.{service.engine}.settings.add-node',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/settings/update/addNode/AddNode.modal'
                      ),
                    ),
                  },
                  {
                    path: 'delete-node',
                    id: 'service.{service.engine}.settings.delete-node',
                    ...lazyRouteConfig(() =>
                      import(
                        '@/pages/services/[serviceId]/settings/update/deleteNode/DeleteNode.modal'
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
