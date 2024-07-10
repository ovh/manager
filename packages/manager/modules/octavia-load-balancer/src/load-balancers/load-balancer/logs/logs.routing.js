import { LOAD_BALANCER_LOGS_TRACKING_HITS } from './logs.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.logs', {
    url: '/logs',
    views: {
      loadbalancerView: 'octaviaLoadBalancerLogs',
    },
    atInternet: {
      rename: LOAD_BALANCER_LOGS_TRACKING_HITS.LOGS_PAGE,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('isLogsToCustomerFeatureAvailable')
        .then((isLogsToCustomerFeatureAvailable) =>
          isLogsToCustomerFeatureAvailable
            ? false
            : {
                state: 'octavia-load-balancer.loadbalancer.general-information',
              },
        ),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('octavia_load_balancer_logs_breadcrumb_label'),
      logKindsList: /* @ngInject */ (logsService, projectId, region) =>
        logsService.getLogKinds(projectId, region),
      kind: /* @ngInject */ (logKindsList, $state) =>
        $state.params.kind || logKindsList[0].name,
      goToListingPage: /* @ngInject */ ($state, $transition$) => (params) =>
        $state.go('octavia-load-balancer.loadbalancer.logs.data-streams', {
          ...$transition$.params(),
          ...params,
        }),
      trackClick: /* @ngInject */ (atInternet) => (hit) => {
        atInternet.trackClick({
          name: hit,
          type: 'action',
        });
      },
    },
  });
};
