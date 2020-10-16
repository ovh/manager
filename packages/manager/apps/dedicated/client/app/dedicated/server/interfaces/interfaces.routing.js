import get from 'lodash/get';
import { GUIDES } from './interfaces.constants';
import { redirectTo } from './ola-pending-task/ola-pending-task.routing';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.interfaces', {
    url: '/interfaces',
    views: {
      'tabView@app.dedicated.server': {
        component: 'dedicatedServerInterfaces',
      },
    },
    translations: { value: ['.'], format: 'json' },
    redirectTo,
    resolve: {
      alertError: /* @ngInject */ ($timeout, $translate, Alerter) => (
        translateId,
        error,
      ) =>
        $timeout(() => {
          Alerter.set(
            'alert-danger',
            $translate.instant(translateId, {
              error: get(error, 'message', error),
            }),
          );
        }),
      failoverIps: /* @ngInject */ (OvhApiIp, serverName) =>
        OvhApiIp.v6().query({
          'routedTo.serviceName': serverName,
          type: 'failover',
        }).$promise,
      guideUrl: /* @ngInject */ (user) =>
        get(GUIDES, `${user.ovhSubsidiary}`, GUIDES.default),
      optionPrice: /* @ngInject */ (
        DedicatedServerInterfacesService,
        server,
        serverName,
        ola,
      ) => {
        // option price is only available for servers migrated to agora
        if (ola.isAvailable() && (!ola.isActivated() || !ola.isConfigured())) {
          return DedicatedServerInterfacesService.getOlaPrice(
            serverName,
            server,
          );
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
      urls: /* @ngInject */ (constants, user) =>
        constants.urls[user.ovhSubsidiary],
      goToInterfaces: ($state, Alerter, serverName) => (
        message = false,
        type = 'success',
      ) => {
        const promise = $state.go('app.dedicated.server.interfaces', {
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
