import Ola from './interfaces/ola.class';

angular.module('App').config(($stateProvider) => {
  $stateProvider.state('app.dedicated.server', {
    url: '/configuration/server/:productId',
    templateUrl: 'dedicated/server/dedicated-server.html',
    controller: 'ServerCtrl',
    reloadOnSearch: false,
    translations: { value: ['.'], format: 'json' },
    redirectTo: 'app.dedicated.server.dashboard',
    resolve: {
      bandwidthOption: /* @ngInject */ (
        Server,
        serverName,
      ) => Server.getBandwidthOption(serverName),
      bandwidthVrackOption: /* @ngInject */ (
        Server,
        serverName,
      ) => Server.getBandwidthVrackOption(serverName),
      bandwidthVrackOrderOptions: /* @ngInject */
      (
        BandwidthVrackOrderService,
        serverName,
      ) => BandwidthVrackOrderService.getOrderableBandwidths(serverName),
      isLegacy: /* @ngInject */ (
        server,
        NEW_RANGE,
      ) => !NEW_RANGE.PATTERN.test(server.commercialRange),
      interfaces: /* @ngInject */ (
        serverName,
        DedicatedServerInterfacesService,
      ) => DedicatedServerInterfacesService.getInterfaces(serverName),
      isOlaAvailable: /* @ngInject */ (coreConfig) => coreConfig.isRegion(['EU', 'CA']),
      ola: /* @ngInject */ (
        interfaces,
        isOlaAvailable,
        specifications,
        $stateParams,
      ) => (isOlaAvailable ? new Ola({
        interfaces,
        ...specifications.ola,
        ...$stateParams,
      }) : null),
      orderPrivateBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) => (isLegacy
        ? $state.href('app.dedicated.server.dashboard.bandwidth-legacy-private-order', { productId: serverName })
        : $state.href('app.dedicated.server.dashboard.bandwidth-private-order', { productId: serverName })),
      orderPublicBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) => (isLegacy
        ? $state.href('app.dedicated.server.dashboard.bandwidth-legacy-public-order', { productId: serverName })
        : $state.href('app.dedicated.server.dashboard.bandwidth-public-order', { productId: serverName })),
      resiliatePrivateBandwidthLink: /* @ngInject */ (
        $state,
        serverName,
      ) => $state.href('app.dedicated.server.dashboard.bandwidth-private-cancel', { productId: serverName }),
      resiliatePublicBandwidthLink: /* @ngInject */ (
        $state,
        serverName,
      ) => $state.href('app.dedicated.server.dashboard.bandwidth-public-cancel', { productId: serverName }),
      server: /* @ngInject */ (
        Server,
        serverName,
      ) => Server.getSelected(serverName),
      serverName: /* @ngInject */ ($transition$) => $transition$.params().productId,
      specifications: /* @ngInject */ (serverName, Server) => Server.getBandwidth(serverName),
      user: /* @ngInject */ (currentUser) => currentUser,
      atTrack: /* @ngInject */ (atInternet) => (name) => atInternet.trackClick({
        name,
        type: 'action',
        chapter1: 'dedicated',
      }),
    },
  });
});
