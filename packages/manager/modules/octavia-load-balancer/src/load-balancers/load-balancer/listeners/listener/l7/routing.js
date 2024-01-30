import { TRACKING_SUFFIX } from './constants';
import { TRACKING_SUFFIX as LISTENERS_TRACKING_SUFFIX } from '../../constants';
import { LISTENER_PROTOCOLS_ENABLING_POLICIES } from '../../list/constants';

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
          `${trackRoot}::${LISTENERS_TRACKING_SUFFIX}::${TRACKING_SUFFIX}`,
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
      onEnter: /* @ngInject */ (
        $transition$,
        $state,
        projectId,
        region,
        loadbalancerId,
      ) => {
        $transition$
          .injector()
          .getAsync('listener')
          .then((listener) => {
            // If the listener we try to access is not compatible with L7 Policies
            // we redirect the user on the listeners list
            // (it should only happen if the user try to access this page via the url directly)
            if (
              !LISTENER_PROTOCOLS_ENABLING_POLICIES.includes(listener.protocol)
            ) {
              return $state.go(
                'octavia-load-balancer.loadbalancer.listeners.list',
                {
                  projectId,
                  region,
                  loadbalancerId,
                },
              );
            }
            return null;
          });
      },
      redirectTo:
        'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
    },
  );
};
