import { POLICIES_TRACKING } from '../../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list.delete',
    {
      url: '/delete?policyId&policyName',
      views: {
        modal: {
          component: 'octaviaLoadBalancerL7PolicyDelete',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        policyId: /* @ngInject */ ($transition$) =>
          $transition$.params().policyId,
        policyName: /* @ngInject */ ($transition$) =>
          $transition$.params().policyName,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
            {},
            reload
              ? {
                  reload:
                    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
                }
              : null,
          ),
        trackL7PolicyDeleteAction: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackClick({
            name: `${POLICIES_TRACKING.DELETE}::${hit}`,
            type: 'action',
          }),
        trackL7PolicyDeletePage: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackPage({ name: `${POLICIES_TRACKING.DELETE}-${hit}` }),
      },
      atInternet: {
        rename: POLICIES_TRACKING.RENAME_DELETE,
      },
    },
  );
};
