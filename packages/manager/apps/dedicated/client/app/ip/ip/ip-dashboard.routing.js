import { listRouting } from '../ip.routing';

import controller from './ip-ip.controller';
import template from './ip-ip.html';

import { TRACKING_PREFIX } from '../ip.constant';
import { DASHBOARD_TRACKING_PREFIX } from './ip-ip.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard', {
    ...listRouting,
    url: '',
    controller,
    template,
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('hasAnyIp')
        .then((hasAnyIp) => (hasAnyIp ? false : 'app.ip.onboarding')),
    resolve: {
      ...listRouting.resolve,
      trackingData: () => ({
        prefix: DASHBOARD_TRACKING_PREFIX.DEFAULT,
        filtersPrefix: DASHBOARD_TRACKING_PREFIX.FILTERS,
      }),
    },
    atInternet: {
      rename: `${TRACKING_PREFIX}::${DASHBOARD_TRACKING_PREFIX.DEFAULT}`,
      level2: 57,
    },
  });
};
