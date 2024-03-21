import { TRACKING_NAME } from '../../../../../constants';
import { TRACKING_SUFFIX as LISTENERS_TRACKING_SUFFIX } from '../../../../constants';
import { TRACKING_SUFFIX as POLICIES_TRACKING_SUFFIX } from '../../constants';
import { TRACKING_SUFFIX as L7_RULES_TRACKING_SUFFIX } from '../constants';
import { TRACKING_SUFFIX } from './constants';

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
        trackL7CreateRuleAction: /* @ngInject */ (trackL7RulesAction) => (
          hit,
        ) => trackL7RulesAction(`${TRACKING_SUFFIX}::${hit}`),
        trackL7CreateRulePage: /* @ngInject */ (trackL7RulesPage) => (hit) =>
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
