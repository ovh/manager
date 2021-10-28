export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'app.dedicatedCloud.details.datacenter.details.datastores',
    {
      reloadOnSearch: false,
      url: '/datastores',
      views: {
        pccDatacenterView: 'ovhManagerDedicatedCloudDatacenterDatastore',
      },
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
              ? 'app.dedicatedCloud.details.datacenter.details.datastores.resourceUpgradeLegacy'
              : 'app.dedicatedCloud.details.datacenter.details.datastores.resourceUpgrade',
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
            'app.dedicatedCloud.details.datacenter.details.datastores',
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
            'app.dedicatedCloud.details.datacenter.details.datastores.convertToGlobal',
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
            'dedicated_cloud_datacenters_datacenter_datastores',
          ),
      },
    },
  );
};
