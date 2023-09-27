import { set } from 'lodash';
import { STATUS } from '../../../../../../../components/project/storages/databases/databases.constants';

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
        addPrivateNetworksLink: /* @ngInject */ ($state, projectId) =>
          $state.href('pci.projects.project.privateNetwork', {
            projectId,
          }),
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
      atInternet: {
        ignore: true,
      },
    },
  );
};
