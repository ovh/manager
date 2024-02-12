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
        getL7RuleCreationLink: /* @ngInject */ (
          coreURLBuilder,
          projectId,
          region,
          loadbalancerId,
          listenerId,
        ) => (policyId) =>
          coreURLBuilder.buildURL(
            'public-cloud',
            `#/pci/projects/${projectId}/octavia-load-balancer/${region}/${loadbalancerId}/listeners/${listenerId}/l7/${policyId}/rules/create`,
          ),
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
