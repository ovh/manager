import { TRACKING_HIT_PREFIX } from './constants';
import { TRACKING_SUFFIX as LISTENERS_TACKING_SUFFIX } from '../../../../constants';
import { TRACKING_SUFFIX as L7_TACKING_SUFFIX } from '../../constants';
import { TRACKING_NAME } from '../../../../../constants';

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
        trackL7PolicyDeleteAction: /* @ngInject */ (trackL7Action) => (hit) =>
          trackL7Action(`${TRACKING_HIT_PREFIX}::${hit}`),
        trackL7PolicyDeletePage: /* @ngInject */ (trackL7Page) => (hit) =>
          trackL7Page(`${TRACKING_HIT_PREFIX}-${hit}`),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${LISTENERS_TACKING_SUFFIX}::${L7_TACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
      },
    },
  );
};
