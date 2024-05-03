import { LOAD_BALANCER_DATA_STREAMS_TRACKING_HITS } from './data-streams.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.logs.data-streams', {
    url: '',
    params: {
      kind: null,
    },
    views: {
      'loadbalancerView@octavia-load-balancer.loadbalancer':
        'octaviaLoadBalancerLogsDataStreams',
    },
    atInternet: {
      rename: LOAD_BALANCER_DATA_STREAMS_TRACKING_HITS.LISTING_PAGE,
    },
    resolve: {
      breadcrumb: () => null,
      kind: /* @ngInject */ ($transition$) => $transition$.params().kind,
      goBack: /* @ngInject  */ ($state, kind, trackClick) => () => {
        trackClick(LOAD_BALANCER_DATA_STREAMS_TRACKING_HITS.GO_BACK);
        $state.go(
          'octavia-load-balancer.loadbalancer.logs',
          { kind },
          { reload: true },
        );
      },
    },
  });
};
