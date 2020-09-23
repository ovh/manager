import template from './private-database-logs.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.logs', {
    url: '/logs',
    template,
    controller: 'PrivateDatabaseLogsCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_logs'),
    },
  });
};
