import { TRACKING_NAME } from '../../../../constants';
import { TRACKING_SUFFIX } from '../../../constants';
import { TRACKING_HIT_PREFIX } from '../../constants';
import { TRACKING_SUFFIX as EDIT_NAME_TRACKING_PREFIX } from './constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'octavia-load-balancer.loadbalancer.pools.detail.general-information.edit-name',
    {
      url: '/edit-name',
      views: {
        modal: {
          component: 'octaviaLoadBalancerPoolsDetailOverviewEditName',
        },
      },
      layout: 'modal',
      resolve: {
        breadcrumb: () => null,
        goBack: /* @ngInject */ ($state) => (reload) =>
          $state.go(
            'octavia-load-balancer.loadbalancer.pools.detail.general-information',
            {},
            reload
              ? { reload: 'octavia-load-balancer.loadbalancer.pools.detail' }
              : null,
          ),
        trackNameEditionAction: /* @ngInject */ (
          atInternet,
          trackDetailAction,
        ) => (hit) => trackDetailAction(`edit-name::${hit}`),
      },
      atInternet: {
        rename: `${TRACKING_NAME}::${TRACKING_SUFFIX}::${TRACKING_HIT_PREFIX}::${EDIT_NAME_TRACKING_PREFIX}`,
      },
    },
  );
};
