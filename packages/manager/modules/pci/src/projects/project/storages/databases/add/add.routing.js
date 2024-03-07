import set from 'lodash/set';
import Database from '../../../../../components/project/storages/databases/database.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('pci.projects.project.storages.databases.add', {
    url: '/new',
    component: 'pciProjectStoragesDatabasesAdd',
    resolve: {
      addPrivateNetworksLink: /* @ngInject */ ($state, projectId) =>
        $state.href('pci.projects.project.privateNetwork', {
          projectId,
        }),

      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('pci_database_add_title'),

      onDatabaseAdd: /* @ngInject */ (
        databases,
        goToDatabase,
        newDatabases,
      ) => (databaseInfo, message, type) => {
        const database = new Database(databaseInfo);
        databases.push(database);
        set(newDatabases, database.id, true);
        return goToDatabase(database, message, type);
      },
      goToCommand: /* @ngInject */ ($state) => (data) => {
        return $state.go(
          'pci.projects.project.storages.databases.add.command',
          {
            data,
          },
        );
      },
    },
  });
};
