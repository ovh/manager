import { redirectTo } from './ola/ola-pending-task.routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server.interfaces', {
    url: '/interfaces',
    views: {
      'tabView@app.dedicated-server.server': {
        component: 'dedicatedServerInterfaces',
      },
    },
    redirectTo,
    resolve: {
      serverService: /* @ngInject */ (Server) => Server,
      alertError: /* @ngInject */ ($timeout, $translate, Alerter) => (
        translateId,
        error,
        appendError = false,
      ) =>
        $timeout(() => {
          const message = error.message || error;
          Alerter.set(
            'alert-danger',
            appendError
              ? `${$translate.instant(translateId)}<br />${message}`
              : $translate.instant(translateId, {
                  error: message,
                }),
          );
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      failoverIps: /* @ngInject */ (OvhApiIp, serverName) =>
        OvhApiIp.v6().query({
          'routedTo.serviceName': serverName,
          type: 'failover',
        }).$promise,
      guideUrl: /* @ngInject */ (DedicatedServerInterfacesService) =>
        DedicatedServerInterfacesService.getGuideUrl(),
      optionPrice: /* @ngInject */ (olaService, server, serverName, ola) => {
        // option price is only available for servers migrated to agora
        if (ola.isAvailable() && (!ola.isActivated() || !ola.isConfigured())) {
          return olaService.getOlaPrice(serverName, server);
        }
        return [];
      },
      orderPrivateBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) =>
        isLegacy
          ? $state.href(
              'app.dedicated-server.server.interfaces.bandwidth-legacy-private-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated-server.server.interfaces.bandwidth-private-order',
              { productId: serverName },
            ),
      orderPublicBandwidthLink: /* @ngInject */ (
        $state,
        isLegacy,
        serverName,
      ) =>
        isLegacy
          ? $state.href(
              'app.dedicated-server.server.interfaces.bandwidth-legacy-public-order',
              { productId: serverName },
            )
          : $state.href(
              'app.dedicated-server.server.interfaces.bandwidth-public-order',
              { productId: serverName },
            ),
      technicalDetails: /* @ngInject */ ($http, serverName) =>
        $http
          .get(`/dedicated/technical-details/${serverName}`, {
            serviceType: 'aapi',
          })
          .then(({ data }) =>
            data?.baremetalServers?.storage ? data?.baremetalServers : null,
          )
          .catch(() => null),
      trafficInformation: /* @ngInject */ (
        $q,
        $stateParams,
        ServerOrderTrafficService,
        ServerTrafficService,
      ) =>
        $q.all({
          traffic: ServerTrafficService.getTraffic($stateParams.productId),
          trafficOption: ServerOrderTrafficService.getOption(
            $stateParams.productId,
          ),
          trafficOrderables: ServerOrderTrafficService.getOrderables(
            $stateParams.productId,
          ),
        }),
      goToTrafficOrder: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.interfaces.traffic-order', {
          productId: serverName,
        }),
      goToTrafficCancel: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.interfaces.traffic-cancel', {
          productId: serverName,
        }),
      urls: /* @ngInject */ (constants, user) =>
        constants.urls[user.ovhSubsidiary],
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('dedicated_server_interfaces'),
      goToInterfaces: ($state, Alerter, serverName) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.dedicated-server.server.interfaces', {
          projectId: serverName,
        });
        if (message) {
          promise.then(() => Alerter[type](message));
        }
        return promise;
      },
    },
  });
};
