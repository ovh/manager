import { listRouting } from '../ip.routing';

import {
  FAILOVER_FILTERS_CHAPTER_1,
  FAILOVER_SERVICE_TYPE,
} from './failover.constants';
import { BADGE_BYOIP } from '../components/list/list.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.failover', {
    ...listRouting,
    url: '/failover',
    params: {
      serviceType: null,
      page: 1,
      pageSize: 10,
    },
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
