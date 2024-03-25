import { RULES_TRACKING } from '../../../constants';

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
        trackL7RuleDeleteAction: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackClick({
            name: `${RULES_TRACKING.DELETE}::${hit}`,
            type: 'action',
          }),
        trackL7RuleDeletePage: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackPage({
            name: `${RULES_TRACKING.DELETE}-${hit}`,
          }),
      },
      atInternet: {
        rename: RULES_TRACKING.RENAME_DELETE,
      },
    },
  );
};
