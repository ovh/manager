import { TRACKING_SUFFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules',
    {
      url: '/:policyId/rules',
      views: {
        'octaviaLoadBalancerView@octavia-load-balancer':
          'octaviaLoadBalancerL7Rules',
      },
      resolve: {
        breadcrumb: () => 'L7 Rules',
        policyId: /* @ngInject */ ($transition$) =>
          $transition$.params().policyId,
        goToL7PoliciesListingPage: /* @ngInject */ ($state) => () =>
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
          ),
        trackL7RulesBase: /* @ngInject */ (trackL7Base) =>
          `${trackL7Base}::${TRACKING_SUFFIX}`,
        trackL7RulesAction: /* @ngInject */ (atInternet, trackL7RulesBase) => (
          hit,
        ) =>
          atInternet.trackClick({
            name: `${trackL7RulesBase}::${hit}`,
            type: 'action',
          }),
        trackL7RulesPage: /* @ngInject */ (atInternet, trackL7RulesBase) => (
          hit,
        ) =>
          atInternet.trackPage({
            name: `${trackL7RulesBase}::${hit}`,
          }),
      },
      redirectTo:
        'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7rules.list',
    },
  );
};
