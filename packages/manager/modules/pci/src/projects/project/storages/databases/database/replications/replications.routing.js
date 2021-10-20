import map from 'lodash/map';
import ServiceIntegration from '../../../../../../components/project/storages/databases/serviceIntegration.class';
import Replication from '../../../../../../components/project/storages/databases/replication.class';
import { DATABASE_TYPES } from '../../databases.constants';
import { STATUS } from '../../../../../../components/project/storages/databases/databases.constants';

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
        replicationsList: /* @ngInject */ (
          DatabaseService,
          database,
          projectId,
          serviceIntegrationList,
        ) =>
          DatabaseService.getReplications(
            projectId,
            database.engine,
            database.id,
          ).then((replications) =>
            map(replications, (r) => {
              const replication = new Replication(r);
              replication.setServicesNames(serviceIntegrationList);
              return replication;
            }),
          ),
        kafkaServicesList: /* @ngInject */ (DatabaseService, projectId) =>
          DatabaseService.getDatabases(projectId, DATABASE_TYPES.KAFKA),
        serviceIntegrationList: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          kafkaServicesList,
        ) =>
          DatabaseService.getIntegrations(
            projectId,
            database.engine,
            database.id,
          ).then((integrations) =>
            map(integrations, (i) => {
              const serviceIntegration = new ServiceIntegration(i);
              serviceIntegration.setServiceName(kafkaServicesList);
              return serviceIntegration;
            }),
          ),
        readyServiceIntegrationList: /* @ngInject */ (serviceIntegrationList) =>
          serviceIntegrationList.filter((s) => s.statusGroup === STATUS.READY),
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
