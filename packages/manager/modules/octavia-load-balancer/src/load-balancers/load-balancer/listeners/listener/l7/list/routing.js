import { POLICIES_TRACKING } from '../constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list',
    {
      url: '/list',
      views: {
        loadbalancerL7View: 'octaviaLoadBalancerL7PoliciesList',
      },
      resolve: {
        breadcrumb: () => null,
        policies: /* @ngInject */ (
          OctaviaLoadBalancerL7Service,
          projectId,
          region,
          listenerId,
        ) =>
          OctaviaLoadBalancerL7Service.getPolicies(
            projectId,
            region,
            listenerId,
          ),
        goToL7PolicyCreation: /* @ngInject */ ($state, atInternet) => () => {
          atInternet.trackClick({
            name: POLICIES_TRACKING.ADD,
            type: 'action',
          });
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.create',
          );
        },
        goToL7PolicyEdition: /* @ngInject */ ($state, atInternet) => (
          policy,
        ) => {
          atInternet.trackClick({
            name: POLICIES_TRACKING.EDIT,
            type: 'action',
          });
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.edit',
            {
              policyId: policy.id,
            },
          );
        },
        getL7PolicyEditionLink: /* @ngInject */ ($state) => (policy) =>
          $state.href(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.edit',
            {
              policyId: policy.id,
            },
          ),
        goToL7Rules: /* @ngInject */ ($state, atInternet) => (policy) => {
          atInternet.trackClick({
            name: POLICIES_TRACKING.MANAGE_RULES,
            type: 'action',
          });
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.l7Rules.list',
            {
              policyId: policy.id,
            },
          );
        },
        goToL7PolicyDeletion: /* @ngInject */ ($state, atInternet) => (
          policy,
        ) => {
          atInternet.trackClick({
            name: POLICIES_TRACKING.DELETE,
            type: 'action',
          });
          $state.go(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.list.delete',
            {
              policyId: policy.id,
              policyName: policy.name,
            },
          );
        },
        getPoolDetailLinkFromPolicy: /* @ngInject */ (getPoolDetailLink) => (
          policy,
        ) => getPoolDetailLink(policy.redirectPoolId),
      },
      atInternet: {
        rename: POLICIES_TRACKING.RENAME_LIST,
      },
    },
  );
};
