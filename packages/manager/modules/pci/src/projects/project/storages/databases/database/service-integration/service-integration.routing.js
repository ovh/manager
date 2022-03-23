import map from 'lodash/map';
import ServiceIntegration from '../../../../../../components/project/storages/databases/serviceIntegration.class';
import { DATABASE_TYPES } from '../../databases.constants';
import { ENGINES_NAMES } from '../../../../../../components/project/storages/databases/engines.constants';
import Database from '../../../../../../components/project/storages/databases/database.class';

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
        servicesList: /* @ngInject */ (
          DatabaseService,
          database,
          projectId,
        ) => {
          switch (database.engine) {
            case DATABASE_TYPES.KAFKA_MIRROR_MAKER:
            case DATABASE_TYPES.KAFKA_CONNECT:
              return DatabaseService.getDatabases(
                projectId,
                DATABASE_TYPES.KAFKA,
              );
            case DATABASE_TYPES.M3AGGEGATOR:
              return DatabaseService.getDatabases(
                projectId,
                DATABASE_TYPES.M3DB,
              );
            default:
              return [];
          }
        },
        serviceIntegrationList: /* @ngInject */ (
          database,
          DatabaseService,
          projectId,
          CucCloudMessage,
          $translate,
          servicesList,
          engineName,
        ) =>
          DatabaseService.getIntegrations(
            projectId,
            database.engine,
            database.id,
          ).then((integrations) => {
            const serviceIntegrations = map(integrations, (i) => {
              const serviceIntegration = new ServiceIntegration(i);
              serviceIntegration.setSourceServiceName(servicesList);
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
                      {
                        engineName,
                      },
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
          servicesList,
          serviceIntegrationList,
        ) =>
          servicesList
            .map((service) => new Database(service))
            .filter(
              (service) =>
                service.isStatusGroupReady() &&
                !serviceIntegrationList.find(
                  (integration) => integration.sourceServiceId === service.id,
                ),
            ),
        replicationsList: /* @ngInject */ (
          DatabaseService,
          database,
          projectId,
        ) =>
          [DATABASE_TYPES.KAFKA_MIRROR_MAKER].includes(database.engine)
            ? DatabaseService.getReplications(
                projectId,
                database.engine,
                database.id,
              )
            : null,
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
        engineName: /* @ngInject */ (database) => {
          switch (database.engine) {
            case DATABASE_TYPES.M3AGGEGATOR:
              return ENGINES_NAMES.m3db;
            case DATABASE_TYPES.KAFKA_CONNECT:
            case DATABASE_TYPES.KAFKA_MIRROR_MAKER:
              return ENGINES_NAMES.kafka;
            default:
              return null;
          }
        },
      },
      atInternet: {
        ignore: true,
      },
    },
  );
};
