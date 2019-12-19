import { DASHBOARD_FEATURES } from './vps-dashboard.constants';

import component from './vps-dashboard.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard', {
    url: '/dashboard',
    resolve: {
      features: /* @ngInject */ (capabilities) => Object.values(DASHBOARD_FEATURES)
        .filter((feature) => capabilities.includes(feature)),
    },
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
  });
};
