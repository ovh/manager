export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.managedBaremetal.datacenter.hosts', {
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
            ? 'app.managedBaremetal.datacenter.hosts.resourceUpgradeLegacy'
            : 'app.managedBaremetal.datacenter.hosts.resourceUpgrade',
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
          'app.managedBaremetal.datacenter.hosts',
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
