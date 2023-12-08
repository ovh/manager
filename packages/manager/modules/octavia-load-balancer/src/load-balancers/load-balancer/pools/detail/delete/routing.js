import { TRACKING_HIT_PREFIX } from './constants';
import { TRACKING_SUFFIX } from '../../constants';
import { TRACKING_NAME } from '../../../constants';
import { deletePoolResolve } from '../../components/delete/utils';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.general-information.delete',
    {
      url: '/delete?poolId&poolName',
      views: {
        modal: {
          component: 'octaviaLoadBalancerPoolsDelete',
        },
      },
      layout: 'modal',
      resolve: {
        ...deletePoolResolve,
        goBack: /* @ngInject */ ($state) => (confirm) =>
          $state.go(
            confirm
              ? 'octavia-load-balancer.loadbalancer.pools'
              : 'octavia-load-balancer.loadbalancer.pools.detail.general-information',
          ),
        alertContainer: () => 'octavia.alerts.pool',
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}`,
      },
    },
  );
};
