import { DedicatedServer } from '@ovh-ux/manager-models';
import { SERVICE_TYPE } from './server.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-server.server', {
    url: '/server/:productId',
    component: 'serverMainPage',
    reloadOnSearch: false,
    redirectTo: 'app.dedicated-server.server.dashboard',
    resolve: {
      statePrefix: /* @ngInject */ () => 'app.dedicated-server.server',
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      isLegacy: /* @ngInject */ (server) => server.newUpgradeSystem === false,
      interfaces: /* @ngInject */ (
        serverName,
        DedicatedServerInterfacesService,
        specifications,
      ) =>
        DedicatedServerInterfacesService.getInterfaces(
          serverName,
          specifications,
        ),
      features: /* @ngInject */ (ovhFeatureFlipping) =>
        ovhFeatureFlipping.checkFeatureAvailability([
          'dedicated-server:backup',
          'dedicated-server:changeOwner',
          'dedicated-server:dns',
          'dedicated-server:upgradeWithTicket',
          'dedicated-server:vmac-unavailable-banner',
        ]),
      ola: /* @ngInject */ (
        $stateParams,
        interfaces,
        specifications,
        olaService,
      ) =>
        olaService.computeOlaData({
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
      serverType: (server) => {
        if (server.iam.tags) {
          return typeof server.iam.tags['ovh:cluster'] !== 'undefined'
            ? 'node'
            : 'server';
        }
        return 'server';
      },
      serverName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      serviceInfos: /* @ngInject */ ($stateParams, Server) =>
        Server.getServiceInfos($stateParams.productId).then((serviceInfo) => ({
          ...serviceInfo,
          serviceType: SERVICE_TYPE,
        })),
      backupStorageAvailable: /* @ngInject */ (Server, serverName, features) =>
        Server.getFtpBackup(serverName).then(
          ({ canOrder, activated }) =>
            features.isFeatureAvailable('dedicated-server:backup') &&
            (canOrder || activated),
        ),
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

      nutanixCluster: /* @ngInject */ (NutanixService, serverName) =>
        NutanixService.getClusters()
          .then((clusters) =>
            NutanixService.constructor.getClusterByNodeName(
              serverName,
              clusters,
            ),
          )
          .catch(() => null),
    },
  });
};
