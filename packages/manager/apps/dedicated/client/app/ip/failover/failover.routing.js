import { listRouting } from '../ip.routing';

import {
  FAILOVER_FILTERS_CHAPTER_1,
  FAILOVER_SERVICE_TYPE,
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
        filtersChapter1: FAILOVER_FILTERS_CHAPTER_1,
      }),
      serviceType: () => FAILOVER_SERVICE_TYPE,
    },
  });
};
