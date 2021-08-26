import template from './private-database-metrics.html';
import controller from './private-database-metrics.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.metrics', {
    url: '/metrics',
    template,
    controller,
    controllerAs: '$ctrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_metrics'),
    },
  });
};
