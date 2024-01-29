import { TRACKING_NAME } from '../../../../../constants';
import { TRACKING_SUFFIX as LISTENERS_TACKING_SUFFIX } from '../../../../constants';
import { TRACKING_SUFFIX as POLICIES_TACKING_SUFFIX } from '../../constants';
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
        breadcrumb: () => 'L7 Rules',
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
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.create',
          );
        },
        goToL7RuleEdition: /* @ngInject */ ($state, trackL7RulesAction) => (
          policy,
        ) => {
          trackL7RulesAction('edit');
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.edit',
            {
              policyId: policy.id,
            },
          );
        },
        goToL7RuleDeletion: /* @ngInject */ ($state, trackL7RulesAction) => (
          policy,
        ) => {
          trackL7RulesAction('delete');
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.delete',
            {
              policyId: policy.id,
            },
          );
        },
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${LISTENERS_TACKING_SUFFIX}::${POLICIES_TACKING_SUFFIX}::${TRACKING_SUFFIX}`,
      },
    },
  );
};
