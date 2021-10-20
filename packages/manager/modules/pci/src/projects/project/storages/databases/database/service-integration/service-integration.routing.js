import map from 'lodash/map';
import ServiceIntegration from '../../../../../../components/project/storages/databases/serviceIntegration.class';
import { DATABASE_TYPES } from '../../databases.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'pci.projects.project.storages.databases.dashboard.service-integration',
    {
      url: '/service-integration',
      views: {
        databaseView:
          'ovhManagerPciStoragesDatabaseServiceIntegrationComponent',
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('pci_databases_service_integration_tab_title'),
        goBackToServiceIntegration: /* @ngInject */ (
          $state,
          CucCloudMessage,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';
          const state =
            'pci.projects.project.storages.databases.dashboard.service-integration';
          const promise = $state.go(state, {}, { reload });
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        kafkaServicesList: /* @ngInject */ (DatabaseService, projectId) =>
          DatabaseService.getDatabases(projectId, DATABASE_TYPES.KAFKA),
        serviceIntegrationList: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          CucCloudMessage,
          $translate,
          kafkaServicesList,
        ) =>
          DatabaseService.getIntegrations(
            projectId,
            database.engine,
            database.id,
          ).then((integrations) => {
            const serviceIntegrations = map(integrations, (i) => {
              const serviceIntegration = new ServiceIntegration(i);
              serviceIntegration.setServiceName(kafkaServicesList);
              return serviceIntegration;
            });
            serviceIntegrations.forEach((i) => {
              if (i.isProcessing()) {
                DatabaseService.pollIntegrationStatus(
                  projectId,
                  database.engine,
                  database.id,
                  i.id,
                ).then((integrationInfos) => {
                  CucCloudMessage.success(
                    $translate.instant(
                      'pci_databases_service_integration_tab_service_ready',
                    ),
                  );
                  i.updateData(integrationInfos);
                });
              }
            });
            return serviceIntegrations;
          }),
        stopPollingIntegrationsStatus: /* @ngInject */ (
          DatabaseService,
          serviceIntegrationList,
          database,
        ) => () =>
          serviceIntegrationList.forEach((s) =>
            DatabaseService.stopPollingIntegrationStatus(database.id, s.id),
          ),
        addableServicesList: /* @ngInject */ (
          kafkaServicesList,
          serviceIntegrationList,
        ) =>
          kafkaServicesList.filter(
            (k) => !serviceIntegrationList.find((i) => i.serviceId === k.id),
          ),
        replicationsList: /* @ngInject */ (
          DatabaseService,
          database,
          projectId,
        ) =>
          DatabaseService.getReplications(
            projectId,
            database.engine,
            database.id,
          ),
        goToAddServiceIntegration: /* @ngInject */ (
          $state,
          databaseId,
          projectId,
        ) => () =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.service-integration.add',
            {
              projectId,
              databaseId,
            },
          ),
        refreshServiceIntegration: /* @ngInject */ (
          $state,
          CucCloudMessage,
        ) => (message = false, type = 'success') => {
          const state =
            'pci.projects.project.storages.databases.dashboard.service-integration';
          const promise = $state.reload();
          if (message) {
            promise.then(() => {
              CucCloudMessage[type](message, state);
            });
          }
          return promise;
        },
        goToDeleteServiceIntegration: /* @ngInject */ ($state) => (
          serviceIntegration,
        ) =>
          $state.go(
            'pci.projects.project.storages.databases.dashboard.service-integration.delete',
            {
              integration: serviceIntegration,
            },
          ),
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
