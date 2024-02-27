import { TRACKING_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.listeners', {
    url: '/listeners',
    views: {
      loadbalancerView: 'octaviaLoadBalancerListeners',
    },
    resolve: {
      breadcrumb: () => 'listeners',
      trackBase: /* @ngInject */ (trackRoot) =>
        `${trackRoot}::${TRACKING_SUFFIX}`,
      trackAction: /* @ngInject */ (atInternet, trackBase) => (hit) =>
        atInternet.trackClick({
          name: `${trackBase}::${hit}`,
          type: 'action',
        }),
      trackPage: /* @ngInject */ (atInternet, trackBase) => (hit) =>
        atInternet.trackPage({
          name: `${trackBase}::${hit}`,
        }),
    },
    redirectTo: 'octavia-load-balancer.loadbalancer.listeners.list',
  });
};
