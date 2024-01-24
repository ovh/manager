import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX as LISTENERS_TACKING_SUFFIX } from '../../../constants';
import { TRACKING_SUFFIX as L7_TACKING_SUFFIX } from '../constants';
import { TRACKING_SUFFIX, UNAVAILABLE_POOL_PROTOCOLS } from './constants';
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
        trackL7CreatePolicyBase: /* @ngInject */ (trackL7Base) =>
          `${trackL7Base}::${TRACKING_SUFFIX}`,
        trackL7CreatePolicyAction: /* @ngInject */ (
          atInternet,
          trackL7CreatePolicyBase,
        ) => (hit) =>
          atInternet.trackClick({
            name: `${trackL7CreatePolicyBase}::${hit}`,
            type: 'action',
          }),
        trackL7CreatePolicyPage: /* @ngInject */ (
          atInternet,
          trackL7CreatePolicyBase,
        ) => (hit) =>
          atInternet.trackPage({
            name: `${trackL7CreatePolicyBase}-${hit}`,
          }),
        getL7RuleCreationLink: /* @ngInject */ ($state) => (policyId) =>
          $state.href(
            'octavia-load-balancer.loadbalancer.listeners.listener.l7Policies.L7Rule.create',
            {
              policyId,
            },
          ),
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
        rename: `${TRACKING_NAME}::${LISTENERS_TACKING_SUFFIX}::${L7_TACKING_SUFFIX}::${TRACKING_SUFFIX}`,
      },
    },
  );
};
