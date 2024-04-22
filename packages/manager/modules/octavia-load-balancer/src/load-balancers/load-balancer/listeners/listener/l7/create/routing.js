import { POLICIES_TRACKING } from '../constants';
import { UNAVAILABLE_POOL_PROTOCOLS } from './constants';
import { LISTENER_POOL_PROTOCOL_COMBINATION } from '../../../components/listener-form/constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.create',
    {
      url: '/create',
      views: {
        loadbalancerL7View: 'octaviaLoadBalancerL7Create',
      },
      resolve: {
        breadcrumb: () => null,
        redirectHttpCodes: /* @ngInject */ (apiSpecifications) =>
          apiSpecifications.models[
            'cloud.loadbalancing.L7PolicyRedirectHTTPCodeEnum'
          ]?.enum,
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
        trackL7CreatePolicyAction: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackClick({
            name: `${POLICIES_TRACKING.ADD}::${hit}`,
            type: 'action',
          }),
        trackL7CreatePolicyPage: /* @ngInject */ (atInternet) => (hit) =>
          atInternet.trackPage({
            name: `${POLICIES_TRACKING.ADD}-${hit}`,
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
        rename: POLICIES_TRACKING.RENAME_ADD,
      },
    },
  );
};
