export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicatedCloud.details.datacenter.details.hosts', {
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
            ? 'app.dedicatedCloud.details.datacenter.details.hosts.resourceUpgradeLegacy'
            : 'app.dedicatedCloud.details.datacenter.details.hosts.resourceUpgrade',
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
          'app.dedicatedCloud.details.datacenter.details.hosts',
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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_cloud_datacenters_datacenter_hosts'),
    },
  });
};
