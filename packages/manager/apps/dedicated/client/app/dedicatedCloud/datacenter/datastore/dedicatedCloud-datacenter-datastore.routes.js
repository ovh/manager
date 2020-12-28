export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.datastores', {
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
            ? 'app.dedicatedClouds.datacenter.datastores.resourceUpgradeLegacy'
            : 'app.dedicatedClouds.datacenter.datastores.resourceUpgrade',
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
          'app.dedicatedClouds.datacenter.datastores',
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
    },
  });
};
