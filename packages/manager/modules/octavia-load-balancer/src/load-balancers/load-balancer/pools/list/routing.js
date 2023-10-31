import { TRACKING_CHAPTER_1, TRACKING_NAME } from '../../constants';
import { TRACKING_SUFFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.pools.list', {
    url: '',
    views: {
      loadbalancerPoolsView: 'octaviaLoadBalancerPoolsList',
    },
    resolve: {
      breadcrumb: () => null,
      pools: /* ngInject */ (
        OctaviaLoadBalancerPoolsService,
        projectId,
        region,
      ) => OctaviaLoadBalancerPoolsService.getPools(projectId, region),
      goToPoolCreation: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::add`,
          type: 'action',
        });
        $state.go('octavia-load-balancer.loadbalancer.pools.create');
      },
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}`,
    },
  });
};
