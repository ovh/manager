import { RULES_TRACKING } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.list',
    {
      url: '/list',
      views: {
        loadbalancerL7RulesView: 'octaviaLoadBalancerL7RulesList',
      },
      resolve: {
        breadcrumb: () => null,
        rules: /* @ngInject */ (
          OctaviaLoadBalancerL7Service,
          projectId,
          region,
          policyId,
        ) => OctaviaLoadBalancerL7Service.getRules(projectId, region, policyId),
        goToL7RuleCreation: /* @ngInject */ ($state, atInternet) => () => {
          atInternet.trackClick({ name: RULES_TRACKING.ADD, type: 'action' });
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.create',
          );
        },
        goToL7RuleEdition: /* @ngInject */ ($state, atInternet) => (rule) => {
          atInternet.trackClick({ name: RULES_TRACKING.EDIT, type: 'action' });
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.edit',
            {
              ruleId: rule.id,
            },
          );
        },
        goToL7RuleDeletion: /* @ngInject */ ($state, atInternet) => (rule) => {
          atInternet.trackClick({
            name: RULES_TRACKING.DELETE,
            type: 'action',
          });
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.list.delete',
            {
              ruleId: rule.id,
            },
          );
        },
      },
      atInternet: {
        rename: RULES_TRACKING.RENAME_LIST,
      },
    },
  );
};
