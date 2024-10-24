import template from './private-database-logs.html';
import controller from './private-database-logs.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.logs', {
    url: '/logs',
    template,
    controller,
    controllerAs: 'listCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_logs'),
    },
  });
};
