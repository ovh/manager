import controllerDiff from './diff/history.controller';
import templateDiff from './diff/history.html';
import controllerDashboard from './dashboard/dashboard.controller';
import templateDashboard from './dashboard/dashboard.html';

const commonResolves = {
  breadcrumb: /* @ngInject */ ($translate) =>
    $translate.instant('zone_history'),
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details.zone-history.diff', {
    url: '/diff',
    views: {
      'dnsZoneView@app.zone.details': {
        controller: controllerDiff,
        template: templateDiff,
      },
    },
    resolve: commonResolves,
    params: {
      selectedDates: null,
      productId: null,
    },
  });
  $stateProvider.state('app.zone.details.zone-history', {
    url: '/zone-history',
    views: {
      'dnsZoneView@app.zone.details': {
        controller: controllerDashboard,
        template: templateDashboard,
      },
    },
    resolve: commonResolves,
    params: {
      productId: null,
    },
  });
};
