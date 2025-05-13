import template from './private-database-metrics.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.metrics', {
    url: '/metrics',
    template,
    controller: 'PrivateDatabaseMetricsCtrl',
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_metrics'),
    },
  });
};
