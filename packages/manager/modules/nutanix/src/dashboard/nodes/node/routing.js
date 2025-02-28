import { SERVICE_STATES } from '../../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes.node', {
    url: '/:nodeId',
    views: {
      'nodeView@nutanix.dashboard': {
        component: 'nutanixNode',
      },
    },
    redirectTo: (transition) => {
      const $translatePromise = transition.injector().getAsync('$translate');
      const isTerminatedPromise = transition
        .injector()
        .getAsync('isTerminated');

      return Promise.all([$translatePromise, isTerminatedPromise]).then(
        ([$translate, isTerminated]) => {
          if (isTerminated) {
            return {
              state: 'error',
              params: {
                detail: {
                  message: $translate.instant(
                    'nutanix_dashboard_service_suspended',
                  ),
                  status: 'EXPIRED',
                  code: 404,
                },
                to: {
                  state: 'nutanix.index',
                },
              },
            };
          }
          return 'nutanix.dashboard.nodes.node.general-info';
        },
      );
    },
    resolve: {
      nodeId: /* @ngInject */ ($transition$) => $transition$.params().nodeId,
      node: /* @ngInject */ (nodeId, NutanixService) =>
        NutanixService.getServer(nodeId),
      isTerminated: /* @ngInject */ (node) =>
        node.serviceStatus === SERVICE_STATES.SUSPENDED,
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      trackingPrefix: /* @ngInject */ () => 'hpc::nutanix::cluster::node',
      breadcrumb: /* @ngInject */ (nodeId) => nodeId,
    },
  });
};
