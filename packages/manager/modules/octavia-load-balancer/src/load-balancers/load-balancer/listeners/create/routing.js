import { TRACKING_HIT_PREFIX } from './constants';
import { TRACKING_SUFFIX } from '../constants';
import { TRACKING_NAME } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.listeners.create', {
    url: '/create',
    views: {
      loadbalancerListenersView: 'octaviaLoadBalancerListenersCreate',
    },
    resolve: {
      breadcrumb: () => null,
      pools: /* @ngInject */ (
        OctaviaLoadBalancerPoolsService,
        projectId,
        region,
        loadbalancerId,
      ) =>
        OctaviaLoadBalancerPoolsService.getPools(
          projectId,
          region,
          loadbalancerId,
        ),
      goBack: /* @ngInject */ ($state) => (reload) =>
        $state.go(
          'octavia-load-balancer.loadbalancer.listeners',
          {},
          reload
            ? { reload: 'octavia-load-balancer.loadbalancer.listeners' }
            : null,
        ),
      trackCreateAction: /* @ngInject */ (trackAction) => (hit) =>
        trackAction(`${TRACKING_HIT_PREFIX}::${hit}`),
      trackCreatePage: /* @ngInject */ (trackPage) => (hit) =>
        trackPage(`${TRACKING_HIT_PREFIX}-${hit}`),
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
    },
  });
};
