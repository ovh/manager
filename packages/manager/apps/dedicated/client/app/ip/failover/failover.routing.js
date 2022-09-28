import { listRouting } from '../ip.routing';

import controller from './failover.controller';
import template from './failover.template.html';

import { FAILOVER_SERVICE_TYPE } from './failover.constants';
import { BADGE_BYOIP } from '../components/list/list.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.failover', {
    ...listRouting,
    url: '/failover',
    params: {
      serviceType: null,
    },
    views: {
      '': {
        controller,
        controllerAs: '$ctrl',
        template,
      },
      'list@app.ip.failover': {
        component: 'ipList',
      },
    },
    resolve: {
      ...listRouting.resolve,
      badges: () => [BADGE_BYOIP],
      serviceType: () => FAILOVER_SERVICE_TYPE,
    },
  });
};
