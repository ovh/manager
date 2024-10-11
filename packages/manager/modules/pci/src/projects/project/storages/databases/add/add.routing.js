import set from 'lodash/set';
import Database from '../../../../../components/project/storages/databases/database.class';
import { URL_MODEL } from './add.constants';
import { useURLModel } from '../../../project.utils';

export default /* @ngInject */ ($stateProvider) => {
  const { query } = useURLModel(URL_MODEL);
  $stateProvider.state('pci.projects.project.storages.databases.add', {
    url: `/new?${query}`,
    component: 'pciProjectStoragesDatabasesAdd',
    resolve: {
      addPrivateNetworksLink: /* @ngInject */ (getUAppUrl, projectId) =>
        getUAppUrl(
          'public-cloud',
          `#/pci/projects/${projectId}/private-networks`,
        ),

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
