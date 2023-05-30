export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.managedBaremetal.details.datacenters.datacenter.datastores',
    {
      reloadOnSearch: false,
      url: '/datastores',
      views: {
        pccDatacenterView: 'ovhManagerDedicatedCloudDatacenterDatastore',
      },
      translations: { value: ['../../../dedicated/server'], format: 'json' },
      resolve: {
        serviceId: /* @ngInject */ (currentService) =>
          currentService.serviceInfos.serviceId,
        resourceUpgrade: /* @ngInject */ ($state, usesLegacyOrder) => (
          id,
          type,
          upgradeType,
        ) =>
          $state.go(
            usesLegacyOrder
              ? 'app.managedBaremetal.details.datacenters.datacenter.datastores.resourceUpgradeLegacy'
              : 'app.managedBaremetal.details.datacenters.datacenter.datastores.resourceUpgrade',
            {
              id,
              type,
              upgradeType,
            },
          ),
        goBackToDatastore: /* @ngInject */ (
          $state,
          $timeout,
          currentService,
          setMessage,
        ) => (message = false, type = 'success') => {
          const reload = message && type === 'success';

          const promise = $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.datastores',
            { productId: currentService.serviceName },
            {
              reload,
            },
          );

          if (message) {
            promise.then(() => $timeout(() => setMessage(message, type)));
          }

          return promise;
        },
        goToConvertToGlobal: /* @ngInject */ (
          $state,
          currentService,
          datacenterId,
        ) => (datastore) => {
          return $state.go(
            'app.managedBaremetal.details.datacenters.datacenter.datastores.convertToGlobal',
            {
              productId: currentService.serviceName,
              datacenterId,
              datastoreId: datastore.id,
              isGlobal: datastore.dc == null,
            },
          );
        },
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant(
            'managed_baremetal_datacenters_datacenter_datastores',
          ),
      },
    },
  );
};
