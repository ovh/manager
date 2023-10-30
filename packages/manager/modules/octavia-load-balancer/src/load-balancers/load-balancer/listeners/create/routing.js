import { TRACKING_SUFFIX } from './constants';
import { TRACKING_CHAPTER_1, TRACKING_NAME } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.listeners.create', {
    url: '/create',
    views: {
      loadbalancerListenersView: 'octaviaLoadBalancerListenersCreate',
    },
    resolve: {
      breadcrumb: () => null,
      pools: /* @ngInject */ (
        OctaviaLoadBalancerListenersService,
        projectId,
        region,
      ) => OctaviaLoadBalancerListenersService.getPools(projectId, region),
      goBack: /* @ngInject */ ($state) => (reload) =>
        $state.go(
          'octavia-load-balancer.loadbalancer.listeners',
          {},
          reload
            ? { reload: 'octavia-load-balancer.loadbalancer.listeners' }
            : null,
        ),
      trackAction: /* @ngInject */ (atInternet) => (hit) =>
        atInternet.trackClick({
          name: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::${TRACKING_SUFFIX}::add${hit}`,
          type: 'action',
        }),
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::add`,
    },
  });
};
