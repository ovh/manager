import MetricsDashboardCtrl from './metrics-dashboard.controller';

import dashboardTemplate from './metrics-dashboard.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('metrics.detail.dashboard', {
    url: '/dashboard',
    views: {
      metricsContent: {
        template: dashboardTemplate,
        controller: MetricsDashboardCtrl,
        controllerAs: '$ctrl',
      },
    },
    resolve: {
      breadcrumb: () => null,
    },
  });
};
