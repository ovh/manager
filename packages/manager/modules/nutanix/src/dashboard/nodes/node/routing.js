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
      const serviceInfoPromise = transition.injector().getAsync('serviceInfo');

      return Promise.all([$translatePromise, serviceInfoPromise]).then(
        ([$translate, serviceInfo]) => {
          if (serviceInfo.isResiliated()) {
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
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      trackingPrefix: /* @ngInject */ () => 'hpc::nutanix::cluster::node',
      breadcrumb: /* @ngInject */ (nodeId) => nodeId,
    },
  });
};
