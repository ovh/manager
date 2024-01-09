import { DedicatedServer } from '@ovh-ux/manager-models';
import { SERVICE_TYPE } from './node.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated-cluster.cluster.node', {
    url: '/node/:productId',
    component: 'serverMainPage',
    redirectTo: 'app.dedicated-cluster.cluster.node.dashboard',
    resolve: {
      statePrefix: /* @ngInject */ () => 'app.dedicated-cluster.cluster.node',
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
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
      clusterId: /* @ngInject */ ($transition$) =>
        $transition$.params().clusterId,
      serverName: /* @ngInject */ ($transition$) =>
        $transition$.params().productId,
      serviceInfos: /* @ngInject */ ($stateParams, Server) =>
        Server.getServiceInfos($stateParams.productId).then((serviceInfo) => ({
          ...serviceInfo,
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
      trackingPrefix: () => 'dedicated::dedicated::node',

      bringYourOwnImage: /* @ngInject */ ($stateParams, Server) =>
        Server.getBringYourOwnImage($stateParams.productId).catch(() => null),
      goToServerDetails: /* @ngInject */ ($state, Alerter, serverName) => (
        message = false,
        type = 'DONE',
        reload = false,
      ) => {
        const promise = $state.go(
          'app.dedicated-cluster.cluster.node',
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
        $state.go('app.dedicated-cluster.cluster.node.dashboard.netboot', {
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
