import { TRACKING_NAME } from '../constants';
import { TRACKING_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.listeners', {
    url: '/listeners',
    views: {
      loadbalancerView: 'octaviaLoadBalancerListeners',
    },
    resolve: {
      breadcrumb: () => 'listeners',
      listeners: /* ngInject */ (
        OctaviaLoadBalancerListenersService,
        projectId,
        region,
        loadbalancerId,
      ) =>
        OctaviaLoadBalancerListenersService.getListeners(
          projectId,
          region,
          loadbalancerId,
        ),
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}`,
    },
  });
};
