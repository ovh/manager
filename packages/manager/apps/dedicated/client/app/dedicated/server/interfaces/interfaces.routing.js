import get from 'lodash/get';
import { GUIDES } from './interfaces.constants';

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
      taskPolling: /* @ngInject */ (
        DedicatedServerInterfacesService,
        serverName,
      ) => DedicatedServerInterfacesService.getTasks(serverName),
      urls: /* @ngInject */ (constants, user) =>
        constants.urls[user.ovhSubsidiary],
    },
  });
};
