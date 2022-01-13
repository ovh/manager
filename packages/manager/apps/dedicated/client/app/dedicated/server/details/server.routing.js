import { DedicatedServer } from '@ovh-ux/manager-models';
import { SERVICE_TYPE } from './server.constants';

import Ola from '../interfaces/ola.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server', {
    url: '/:productId',
    component: 'dedicatedServer',
    reloadOnSearch: false,
    redirectTo: 'app.dedicated-server.server.dashboard',
    resolve: {
      resiliationCapability: /* @ngInject */ ($http, serverName) =>
        $http
          .get(`/incident/resiliation/${serverName}`, {
            serviceType: 'aapi',
          })
          .then(({ data }) => data)
          .catch(() => null),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      isLegacy: /* @ngInject */ (server) => server.newUpgradeSystem === false,
      interfaces: /* @ngInject */ (
        serverName,
        DedicatedServerInterfacesService,
      ) => DedicatedServerInterfacesService.getInterfaces(serverName),
      features: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability([
          'dedicated-server:backup',
          'dedicated-server:changeOwner',
          'dedicated-server:dns',
          'dedicated-server:firewall',
          'dedicated-server:upgradeWithTicket',
        ]),
      ola: /* @ngInject */ ($stateParams, interfaces, specifications) =>
        new Ola({
          interfaces,
          ...specifications.ola,
          ...$stateParams,
        }),
      schema: /* @ngInject */ (OvhApiDedicatedServer) =>
        OvhApiDedicatedServer.v6().schema().$promise,
      server: /* @ngInject */ (Server, serverName) =>
        Server.getSelected(serverName).then(
          (swsResponse) => new DedicatedServer(swsResponse),
        ),
      serverName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      serviceInfos: /* @ngInject */ (
        $stateParams,
        resiliationCapability,
        Server,
      ) =>
        Server.getServiceInfos($stateParams.productId).then((serviceInfo) => ({
          ...serviceInfo,
          status:
            resiliationCapability?.billingInformation &&
            serviceInfo.status === 'ok' &&
            !serviceInfo.renew?.deleteAtExpiration
              ? 'FORCED_MANUAL'
              : serviceInfo.status,
          statusHelp: resiliationCapability?.billingInformation || null,
          serviceType: SERVICE_TYPE,
        })),
      specifications: /* @ngInject */ (serverName, Server) =>
        Server.getBandwidth(serverName),
      user: /* @ngInject */ (currentUser) => currentUser,
      atTrack: /* @ngInject */ (atInternet) => (name) =>
        atInternet.trackClick({
          name,
          type: 'action',
          chapter1: 'dedicated',
        }),
      worldPart: /* @ngInject */ (coreConfig) => coreConfig.getRegion(),

      breadcrumb: /* @ngInject */ (server) => server.displayName,
      trackingPrefix: () => 'dedicated::dedicated::server',

      bringYourOwnImage: /* @ngInject */ ($stateParams, Server) =>
        Server.getBringYourOwnImage($stateParams.productId).catch(() => null),
      goToServerDetails: /* @ngInject */ ($state, Alerter, serverName) => (
        message = false,
        type = 'DONE',
        reload = false,
      ) => {
        const promise = $state.go(
          'app.dedicated-server.server',
          {
            productId: serverName,
          },
          {
            reload,
          },
        );

        if (message) {
          promise.then(() => {
            Alerter.alertFromSWS(
              message,
              type,
              message.id || 'server_dashboard_alert',
            );
          });
        }

        return promise;
      },

      handleError: /* @ngInject */ (Alerter) => (error) =>
        Alerter.error(
          error.message || error.data?.message,
          'server_dashboard_alert',
        ),

      handleSuccess: /* @ngInject */ (Alerter) => (message) =>
        Alerter.success(message, 'server_dashboard_alert'),

      goToNetboot: /* @ngInject */ ($state, serverName) => () =>
        $state.go('app.dedicated-server.server.dashboard.netboot', {
          productId: serverName,
        }),
    },
  });
};
