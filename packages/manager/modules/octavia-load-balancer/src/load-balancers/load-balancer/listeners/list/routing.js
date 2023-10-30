import { TRACKING_CHAPTER_1, TRACKING_NAME } from '../../constants';
import { TRACKING_SUFFIX } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('octavia-load-balancer.loadbalancer.listeners.list', {
    url: '',
    views: {
      loadbalancerListenersView: 'octaviaLoadBalancerListenersList',
    },
    resolve: {
      breadcrumb: () => null,
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
      goToListenerCreation: /* @ngInject */ ($state, atInternet) => () => {
        atInternet.trackClick({
          name: `${TRACKING_CHAPTER_1}::${TRACKING_NAME}::add`,
          type: 'action',
        });
        $state.go('octavia-load-balancer.loadbalancer.listeners.create');
      },
    },
    atInternet: {
      rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}`,
    },
  });
};
