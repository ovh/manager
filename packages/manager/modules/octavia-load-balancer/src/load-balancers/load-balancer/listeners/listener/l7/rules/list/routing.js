import { TRACKING_NAME } from '../../../../../constants';
import { TRACKING_SUFFIX as LISTENERS_TRACKING_SUFFIX } from '../../../../constants';
import { TRACKING_SUFFIX as POLICIES_TRACKING_SUFFIX } from '../../constants';
import { TRACKING_SUFFIX } from '../constants';

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
        goToL7RuleCreation: /* @ngInject */ (
          $state,
          trackL7RulesAction,
        ) => () => {
          trackL7RulesAction('create');
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.create',
          );
        },
        goToL7RuleEdition: /* @ngInject */ ($state, trackL7RulesAction) => (
          rule,
        ) => {
          trackL7RulesAction('edit');
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.edit',
            {
              ruleId: rule.id,
            },
          );
        },
        goToL7RuleDeletion: /* @ngInject */ ($state, trackL7RulesAction) => (
          rule,
        ) => {
          trackL7RulesAction('delete');
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.list.delete',
            {
              ruleId: rule.id,
            },
          );
        },
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${LISTENERS_TRACKING_SUFFIX}::${POLICIES_TRACKING_SUFFIX}::${TRACKING_SUFFIX}`,
      },
    },
  );
};
