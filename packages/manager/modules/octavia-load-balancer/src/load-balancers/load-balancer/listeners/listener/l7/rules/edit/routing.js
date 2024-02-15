import { TRACKING_NAME } from '../../../../../constants';
import { TRACKING_SUFFIX as LISTENERS_TRACKING_SUFFIX } from '../../../../constants';
import { TRACKING_SUFFIX as POLICIES_TRACKING_SUFFIX } from '../../constants';
import { TRACKING_SUFFIX as L7_RULES_TRACKING_SUFFIX } from '../constants';
import { TRACKING_SUFFIX } from './constants';

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
        trackL7EditRuleAction: /* @ngInject */ (trackL7RulesAction) => (hit) =>
          trackL7RulesAction(`${TRACKING_SUFFIX}::${hit}`),
        trackL7EditRulePage: /* @ngInject */ (trackL7RulesPage) => (hit) =>
          trackL7RulesPage(`${TRACKING_SUFFIX}-${hit}`),
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
        rename: `${TRACKING_NAME}::${LISTENERS_TRACKING_SUFFIX}::${POLICIES_TRACKING_SUFFIX}::${L7_RULES_TRACKING_SUFFIX}::${TRACKING_SUFFIX}`,
      },
    },
  );
};
