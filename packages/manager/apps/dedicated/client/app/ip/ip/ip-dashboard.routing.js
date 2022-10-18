import { listRouting } from '../ip.routing';

import controller from './ip-ip.controller';
import template from './ip-ip.html';

import { IP_FILTERS_CHAPTER_1 } from './ip-ip.constant';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.ip.dashboard', {
    ...listRouting,
    url: '',
    params: {
      serviceName: '',
    },
    views: {
      '': {
        controller,
        template,
      },
      'list@app.ip.dashboard': {
        component: 'ipList',
      },
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('hasAnyIp')
        .then((hasAnyIp) => (hasAnyIp ? false : 'app.ip.onboarding')),
    resolve: {
      ...listRouting.resolve,
      trackingData: () => ({
        filtersChapter1: IP_FILTERS_CHAPTER_1,
      }),
    },
  });
};
