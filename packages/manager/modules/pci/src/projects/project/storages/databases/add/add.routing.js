import set from 'lodash/set';
import { PROJECT_DISCOVERY_PLANCODE } from './add.constants';

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

      lab: /* @ngInject */ (PciProjectLabsService, projectId) =>
        PciProjectLabsService.getLabByName(projectId, 'databases'),

      isDiscoveryProject: /* @ngInject */ (project) => {
        return project.planCode !== PROJECT_DISCOVERY_PLANCODE;
      },

      onDatabaseAdd: /* @ngInject */ (
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
