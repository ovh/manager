import { listRouting } from '../ip.routing';

import controller from './ip-ip.controller';
import template from './ip-ip.html';

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
  });
};
