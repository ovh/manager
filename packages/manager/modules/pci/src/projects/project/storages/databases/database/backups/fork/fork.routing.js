import { set } from 'lodash';
import { STATUS } from '../../../../../../../components/project/storages/databases/databases.constants';
import Database from '../../../../../../../components/project/storages/databases/database.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.backups.fork',
    {
      url: '/fork?restoreMode&backupId',
      params: {
        database: null,
        backupId: null,
      },
      component: 'ovhManagerPciStoragesDatabaseBackupsForkComponent',
      resolve: {
        addPrivateNetworksLink: /* @ngInject */ (getUAppUrl, projectId) =>
          getUAppUrl(
            'public-cloud',
            `#/pci/projects/${projectId}/private-networks`,
          ),
        backupList: (database, DatabaseService, projectId) =>
          DatabaseService.getBackups(
            projectId,
            database.engine,
            database.id,
          ).then((backups) =>
            backups.filter((backup) => backup.status === STATUS.READY),
          ),
        breadcrumb: () => null,
        restoreMode: /* @ngInject */ ($transition$) =>
          $transition$.params().restoreMode,
        backupId: /* @ngInject */ ($transition$) =>
          $transition$.params().backupId,
        goToCommand: /* @ngInject */ ($state) => (data) => {
          return $state.go(
            'pci.projects.project.storages.databases.dashboard.backups.fork.command',
            {
              data,
            },
          );
        },
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
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
