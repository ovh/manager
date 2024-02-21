import { RULES_TRACKING } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.create',
    {
      url: '/create',
      views: {
        loadbalancerL7RulesView: 'octaviaLoadBalancerL7RuleCreate',
      },
      resolve: {
        breadcrumb: () => null,
        ruleTypes: /* @ngInject */ (apiSpecifications) =>
          apiSpecifications.models['cloud.loadbalancing.L7RuleTypeEnum']?.enum,
        ruleCompareTypes: /* @ngInject */ (apiSpecifications) =>
          apiSpecifications.models['cloud.loadbalancing.L7RuleCompareTypeEnum']
            ?.enum,
        trackL7CreateRuleAction: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackClick({
            name: `${RULES_TRACKING.ADD}::${hit}`,
            type: 'action',
          }),
        trackL7CreateRulePage: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackPage({ name: `${RULES_TRACKING.ADD}-${hit}` }),
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
        rename: RULES_TRACKING.RENAME_ADD,
      },
    },
  );
};
