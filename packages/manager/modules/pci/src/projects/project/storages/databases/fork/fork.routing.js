import set from 'lodash/set';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases.fork', {
    url: '/fork',
    params: {
      backupInstance: null,
      database: null,
    },
    component: 'pciProjectStoragesDatabasesFork',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_database_fork_title'),

      lab: /* @ngInject */ (PciProjectLabsService, projectId) =>
        PciProjectLabsService.getLabByName(projectId, 'databases'),

      backupInstance: /* @ngInject */ ($transition$) =>
        $transition$.params().backupInstance,

      database: /* @ngInject */ ($transition$) =>
        $transition$.params().database,

      onDatabaseFork: /* @ngInject */ (
        databases,
        getDatabaseObject,
        goToDatabase,
        newDatabases,
      ) => (databaseInfo, message, type) =>
        getDatabaseObject(databaseInfo).then((database) => {
          databases.push(database);
          set(newDatabases, database.id, true);
          return goToDatabase(database, message, type);
        }),
    },
  });
};
