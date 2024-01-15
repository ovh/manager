import { TRACKING_SUFFIX } from './constants';
import { TRACKING_SUFFIX as LISTENERS_TACKING_SUFFIX } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies',
    {
      url: '/l7',
      views: {
        'octaviaLoadBalancerView@octavia-load-balancer':
          'octaviaLoadBalancerL7',
      },
      resolve: {
        breadcrumb: () => 'L7 Policies',
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
        goToListenerListingPage: /* @ngInject */ ($state) => () => {
          $state.go('octavia-load-balancer.loadbalancer.listeners.list');
        },
        trackL7Base: /* @ngInject */ (trackRoot) =>
          `${trackRoot}::${LISTENERS_TACKING_SUFFIX}::${TRACKING_SUFFIX}`,
        trackL7Action: /* @ngInject */ (atInternet, trackL7Base) => (hit) =>
          atInternet.trackClick({
            name: `${trackL7Base}::${hit}`,
            type: 'action',
          }),
        trackL7Page: /* @ngInject */ (atInternet, trackL7Base) => (hit) =>
          atInternet.trackPage({
            name: `${trackL7Base}::${hit}`,
          }),
      },
      redirectTo:
        'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
    },
  );
};
