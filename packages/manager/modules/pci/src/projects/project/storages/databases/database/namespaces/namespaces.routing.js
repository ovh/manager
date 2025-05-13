export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.namespaces',
    {
      url: '/namespaces',
      views: {
        databaseView: 'ovhManagerPciStoragesDatabaseNamespacesComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_namespaces_tab_title'),
        goBackToNamespaces: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.namespaces';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        namespacesList: /* @ngInject */ (
          DatabaseService,
          database,
          projectId,
        ) =>
          DatabaseService.getNamespaces(
            projectId,
            database.engine,
            database.id,
          ),
        refreshNamespaces: /* @ngInject */ ($state, CucCloudMessage) => (
          message = false,
          type = 'success',
        ) => {
          const state =
            'pci.projects.project.storages.databases.dashboard.namespaces';
          const promise = $state.reload();
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToAddNamespace: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.namespaces.add',
            {
              projectId,
              databaseId,
            },
          ),
        goToEditNamespace: /* @ngInject */ ($state, databaseId, projectId) => (
          namespace,
        ) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.namespaces.edit',
            {
              projectId,
              databaseId,
              namespace,
            },
          ),
        goToDeleteNamespace: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => (namespace) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.namespaces.delete',
            {
              projectId,
              databaseId,
              namespace,
            },
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
