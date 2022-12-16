import { listRouting } from '../ip.routing';

import { TRACKING_PREFIX } from '../ip.constant';
import {
  FAILOVER_SERVICE_TYPE,
  FAILOVER_TRACKING_PREFIX,
} from './failover.constants';
import { BADGE_BYOIP } from '../components/list/list.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.failover', {
    ...listRouting,
    url: '/failover?unused',
    params: {
      unused: { inherit: false, value: '0' },
    },
    component: 'ipFailover',
    resolve: {
      ...listRouting.resolve,
      badges: () => [BADGE_BYOIP],
      trackingData: () => ({
        prefix: FAILOVER_TRACKING_PREFIX.DEFAULT,
        filtersPrefix: FAILOVER_TRACKING_PREFIX.FILTERS,
      }),
      serviceType: () => FAILOVER_SERVICE_TYPE,
      unusedFilter: /* @ngInject */ ($transition$) =>
        $transition$.params().unused?.toString() === '1',
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::${FAILOVER_TRACKING_PREFIX.DEFAULT}`,
    },
  });
};
