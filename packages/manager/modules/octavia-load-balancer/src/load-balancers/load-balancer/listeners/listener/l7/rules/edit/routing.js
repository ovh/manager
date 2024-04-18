import { RULES_TRACKING } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.edit',
    {
      url: '/:ruleId/edit',
      views: {
        loadbalancerL7RulesView:
          'octaviaLoadBalancerListenersListenerL7RuleEdit',
      },
      resolve: {
        breadcrumb: () => null,
        ruleId: /* @ngInject */ ($transition$) => $transition$.params().ruleId,
        rule: /* @ngInject */ (
          OctaviaLoadBalancerL7Service,
          projectId,
          region,
          policyId,
          ruleId,
        ) =>
          OctaviaLoadBalancerL7Service.getRule(
            projectId,
            region,
            policyId,
            ruleId,
          ),
        trackL7EditRuleAction: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackClick({
            name: `${RULES_TRACKING.EDIT}::${hit}`,
            type: 'action',
          }),
        trackL7EditRulePage: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackPage({ name: `${RULES_TRACKING.EDIT}-${hit}` }),
        goBackToL7RulesList: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.list',
            {},
            reload
              ? {
                  reload:
                    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.list',
                }
              : null,
          ),
      },
      atInternet: {
        rename: RULES_TRACKING.RENAME_EDIT,
      },
    },
  );
};
