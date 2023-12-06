import { TRACKING_HIT_PREFIX } from './constants';
import { TRACKING_SUFFIX } from '../constants';
import { TRACKING_NAME } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.listeners.edit', {
    url: '/:listenerId/edit',
    views: {
      loadbalancerListenersView: 'octaviaLoadBalancerListenersEdit',
    },
    resolve: {
      breadcrumb: () => null,
      listenerId: /* @ngInject */ ($transition$) =>
        $transition$.params().listenerId,
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
      listener: /* @ngInject */ (
        OctaviaLoadBalancerListenersService,
        projectId,
        region,
        listenerId,
      ) =>
        OctaviaLoadBalancerListenersService.getListener(
          projectId,
          region,
          listenerId,
        ),
      goBack: /* @ngInject */ ($state) => (reload) =>
        $state.go(
          'octavia-load-balancer.loadbalancer.listeners',
          {},
          reload
            ? { reload: 'octavia-load-balancer.loadbalancer.listeners' }
            : null,
        ),
      trackEditAction: /* @ngInject */ (trackAction) => (hit) =>
        trackAction(`${TRACKING_HIT_PREFIX}::${hit}`),
      trackEditPage: /* @ngInject */ (trackPage) => (hit) =>
        trackPage(`${TRACKING_HIT_PREFIX}-${hit}`),
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
    },
  });
};
