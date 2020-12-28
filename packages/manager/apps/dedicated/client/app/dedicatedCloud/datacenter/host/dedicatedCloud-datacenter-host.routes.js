export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedClouds.datacenter.hosts', {
    reloadOnSearch: false,
    url: '/hosts',
    views: {
      pccDatacenterView: 'ovhManagerDedicatedCloudDatacenterHost',
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
            ? 'app.dedicatedClouds.datacenter.hosts.resourceUpgradeLegacy'
            : 'app.dedicatedClouds.datacenter.hosts.resourceUpgrade',
          {
            id,
            type,
            upgradeType,
          },
        ),
      goBackToHost: /* @ngInject */ (
        $state,
        $timeout,
        currentService,
        setMessage,
      ) => (message = false, type = 'success') => {
        const reload = message && type === 'success';

        const promise = $state.go(
          'app.dedicatedClouds.datacenter.hosts',
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
