export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.replications',
    {
      url: '/replications',
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseReplicationsComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_replications_tab_title'),
        goBackToReplications: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.replications';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        replicationsList: /* @ngInject */ () => [
          {
            source: 'source',
            target: 'target',
            topics: [
              'logs_*',
              'logs_*',
              'logs_*',
              'admin_*',
              '*_logs_*',
              'logs_*',
              'logs_*',
              'logs_*',
              'logs_*',
              'admin_*',
              '*_logs_*',
              'logs_*',
              'logs_*',
              'logs_*',
              'logs_*',
              'admin_*',
              '*_logs_*',
              'logs_*',
              'logs_*',
              'logs_*',
              'logs_*',
              'admin_*',
              '*_logs_*',
              'logs_*',
            ],
            topicsBlacklist: [
              'logs_*',
              'logs_*',
              'logs_*',
              'admin_*',
              '*_logs_*',
              'logs_*',
            ],
            syncGroupOffset: true,
            syncInterval: 60,
            status: 'enabled',
          },
          {
            source: 'source1',
            target: 'target2',
            topics: [
              'logs_*',
              'logs_*',
              'logs_*',
              'admin_*',
              '*_logs_*',
              'users_*',
            ],
            topicsBlacklist: [
              'logs_*',
              'logs_*',
              'logs_*',
              'admin_*',
              '*_logs_*',
              'logs_*',
            ],
            syncGroupOffset: true,
            syncInterval: 60,
            status: 'enabled',
          },
        ],
        goToAddReplications: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.replications.add',
            {
              projectId,
              databaseId,
            },
          ),
        goToEditReplications: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => (replication) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.replications.add',
            {
              projectId,
              databaseId,
              replication,
            },
          ),
        refreshReplications: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const state =
            'pci.projects.project.storages.databases.dashboard.replications';
          const promise = $state.reload();
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToDeleteReplications: /* @ngInject */ ($state) => (user) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.replications.delete',
            {
              user,
            },
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
