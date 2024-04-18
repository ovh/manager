import { POLICIES_TRACKING } from '../constants';
import { UNAVAILABLE_POOL_PROTOCOLS } from './constants';
import { LISTENER_POOL_PROTOCOL_COMBINATION } from '../../../components/listener-form/constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.edit',
    {
      url: '/:policyId/edit',
      views: {
        loadbalancerL7View: 'octaviaLoadBalancerL7Edit',
      },
      resolve: {
        breadcrumb: () => null,
        redirectHttpCodes: /* @ngInject */ (apiSpecifications) =>
          apiSpecifications.models[
            'cloud.loadbalancing.L7PolicyRedirectHTTPCodeEnum'
          ]?.enum,
        policyId: /* @ngInject */ ($transition$) =>
          $transition$.params().policyId,
        policy: /* @ngInject */ (
          OctaviaLoadBalancerL7Service,
          projectId,
          region,
          policyId,
        ) =>
          OctaviaLoadBalancerL7Service.getPolicy(projectId, region, policyId),
        pools: /* @ngInject */ (
          OctaviaLoadBalancerPoolsService,
          projectId,
          region,
          loadbalancerId,
          listener,
        ) =>
          OctaviaLoadBalancerPoolsService.getPools(
            projectId,
            region,
            loadbalancerId,
          ).then((pools) =>
            pools.filter(
              (pool) =>
                !UNAVAILABLE_POOL_PROTOCOLS.includes(pool.protocol) &&
                LISTENER_POOL_PROTOCOL_COMBINATION[listener.protocol].includes(
                  pool.protocol,
                ),
            ),
          ),
        trackL7EditPolicyAction: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackClick({
            name: `${POLICIES_TRACKING.EDIT}::${hit}`,
            type: 'action',
          }),
        trackL7EditPolicyPage: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackPage({
            name: `${POLICIES_TRACKING.EDIT}-${hit}`,
          }),
        goBackToL7PoliciesList: /* @ngInject */ ($state) => (reload) =>
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
      },
      atInternet: {
        rename: POLICIES_TRACKING.RENAME_EDIT,
      },
    },
  );
};
