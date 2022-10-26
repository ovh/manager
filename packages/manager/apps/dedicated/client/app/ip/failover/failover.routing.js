import { listRouting } from '../ip.routing';

import { TRACKING_PREFIX } from '../ip.constant';
import {
  FAILOVER_SERVICE_TYPE,
  FAILOVER_TRACKING_PREFIX,
} from './failover.constants';
import { BADGE_BYOIP } from '../components/list/list.constant';

export default /* @ngInject */ ($stateProvider) => {
  const state = 'app.ip.failover';
  const params = {
    serviceType: null,
    page: null,
    pageSize: null,
  };

  $stateProvider.state(state, {
    ...listRouting,
    url: '/failover',
    redirectTo: (transition) => {
      if (transition.from().name === state) {
        return false;
      }
      const { serviceType, page, pageSize } = transition.params();
      return [serviceType, page, pageSize].some((param) => param !== null)
        ? { state, params }
        : false;
    },
    params,
    component: 'ipFailover',
    resolve: {
      ...listRouting.resolve,
      badges: () => [BADGE_BYOIP],
      trackingData: () => ({
        prefix: FAILOVER_TRACKING_PREFIX.DEFAULT,
        filtersPrefix: FAILOVER_TRACKING_PREFIX.FILTERS,
      }),
      serviceType: () => FAILOVER_SERVICE_TYPE,
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::${FAILOVER_TRACKING_PREFIX.DEFAULT}`,
    },
  });
};
