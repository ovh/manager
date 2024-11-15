export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nutanix.dashboard.nodes', {
    url: '/nodes',
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
                  state: 'nutanix.dashboard.nodes.all',
                },
              },
            };
          }
          return 'nutanix.dashboard.nodes.node.general-info';
        },
      );
    },
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('nutanix_dashboard_nodes'),
    },
  });
};
