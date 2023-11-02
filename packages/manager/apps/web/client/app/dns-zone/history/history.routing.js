import controllerDiff from './diff/history.controller';
import templateDiff from './diff/history.html';
import controllerDashboard from './dashboard/dashboard.controller';
import templateDashboard from './dashboard/dashboard.html';

const commonResolves = {
  breadcrumb: /* @ngInject */ ($translate) =>
    $translate.instant('zone_history'),
};

/**
 * TODO: change here resolved url
 * @param $stateProvider
 */
export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.zone.details.diff', {
    views: {
      'dnsZoneView@app.zone.details': {
        controller: controllerDiff,
        controllerAs: 'ctrlDomainHistoryOfZoneDns',
        template: templateDiff,
      },
    },
    resolve: commonResolves,
    params: {
      productId: null,
    },
  });
  $stateProvider.state('app.zone.details.history', {
    views: {
      'dnsZoneView@app.zone.details': {
        controller: controllerDashboard,
        controllerAs: 'ctrlDashboardHistoryOfZoneDns',
        template: templateDashboard,
      },
    },
    resolve: commonResolves,
    params: {
      productId: null,
    },
  });
};
