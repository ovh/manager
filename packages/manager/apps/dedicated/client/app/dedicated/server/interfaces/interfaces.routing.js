export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces', {
    url: '/interfaces?:configStep',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerInterfaces',
      },
    },
    translations: { value: ['.'], format: 'json' },
    params: {
      configStep: { dynamic: true },
    },
    resolve: {
      alertError: /* @ngInject */ ($timeout, $translate, Alerter) => (
        translateId,
        error,
      ) =>
        $timeout(() => {
          Alerter.set(
            'alert-danger',
            $translate.instant(translateId, { error: error.message }),
          );
        }),
      failoverIps: /* @ngInject */ (OvhApiIp, serverName) =>
        OvhApiIp.v6().query({
          'routedTo.serviceName': serverName,
          type: 'failover',
        }).$promise,
      optionPrice: /* @ngInject */ (
        $q,
        isOlaAvailable,
        DedicatedServerInterfacesService,
        serverName,
      ) =>
        isOlaAvailable
          ? DedicatedServerInterfacesService.getOlaPrice(serverName)
          : $q.resolve(),
      orderPrivateBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) =>
        isLegacy
          ? $state.href(
              'app.dedicated.server.interfaces.bandwidth-legacy-private-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated.server.interfaces.bandwidth-private-order',
              { productId: serverName },
            ),
      orderPublicBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) =>
        isLegacy
          ? $state.href(
              'app.dedicated.server.interfaces.bandwidth-legacy-public-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated.server.interfaces.bandwidth-public-order',
              { productId: serverName },
            ),
      resiliatePrivateBandwidthLink: /* @ngInject */ ($state, serverName) =>
        $state.href(
          'app.dedicated.server.interfaces.bandwidth-private-cancel',
          { productId: serverName },
        ),
      resiliatePublicBandwidthLink: /* @ngInject */ ($state, serverName) =>
        $state.href('app.dedicated.server.interfaces.bandwidth-public-cancel', {
          productId: serverName,
        }),
      taskPolling: /* @ngInject */ (
        DedicatedServerInterfacesService,
        serverName,
      ) => DedicatedServerInterfacesService.getTasks(serverName),
      urls: /* @ngInject */ (constants, user) =>
        constants.urls[user.ovhSubsidiary],
    },
  });
};
