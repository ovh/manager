import { TRACKING_HIT_PREFIX } from './constants';
import { TRACKING_SUFFIX as RULES_TRACKING_SUFFIX } from '../../constants';
import { TRACKING_SUFFIX as POLICIES_TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_SUFFIX as LISTENERS_TRACKING_SUFFIX } from '../../../../../constants';
import { TRACKING_NAME } from '../../../../../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.list.delete',
    {
      url: '/delete?ruleId',
      views: {
        modal: {
          component: 'octaviaLoadBalancerListenersListenerL7RuleDelete',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        ruleId: /* @ngInject */ ($transition$) => $transition$.params().ruleId,
        goBack: /* @ngInject */ ($state) => (reload) =>
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
        trackL7RuleDeleteAction: /* @ngInject */ (trackL7RulesAction) => (
          hit,
        ) => trackL7RulesAction(`${TRACKING_HIT_PREFIX}::${hit}`),
        trackL7RuleDeletePage: /* @ngInject */ (trackL7RulesPage) => (hit) =>
          trackL7RulesPage(`${TRACKING_HIT_PREFIX}-${hit}`),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${LISTENERS_TRACKING_SUFFIX}::${POLICIES_TRACKING_SUFFIX}::${RULES_TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
      },
    },
  );
};
