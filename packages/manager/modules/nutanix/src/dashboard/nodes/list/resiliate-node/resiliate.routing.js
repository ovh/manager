import { SERVICE_TYPE } from './constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.all.resiliate-node', {
    url: '/resiliate/:node',
    views: {
      modal: {
        component: 'billingAutorenewTerminateAgoraService',
      },
    },
    params: {
      node: null,
    },
    layout: 'modal',
    resolve: {
      serviceType: () => SERVICE_TYPE,
      nodeName: /* @ngInject */ ($transition$) => $transition$.params().node,
      serviceName: /* @ngInject */ (nodeName) => nodeName,
      id: /* ngInject */ (server) => server.serviceId,
      server: /* @ngInject */ (nodeName, NutanixService) =>
        NutanixService.getServer(nodeName),
      goBack: /* @ngInject */ (
        $state,
        $timeout,
        Alerter,
        clusterServiceName,
      ) => (message, type) => {
        const promise = $state.go('nutanix.dashboard.nodes.all', {
          serviceName: clusterServiceName,
        });

        if (message) {
          promise.then(() =>
            $timeout(() =>
              Alerter.set(
                `alert-${type}`,
                message,
                null,
                'nutanix_dashboard_alert',
              ),
            ),
          );
        }

        return promise;
      },
    },
  });
};
