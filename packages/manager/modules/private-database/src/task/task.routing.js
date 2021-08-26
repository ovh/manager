import template from './private-database-task.html';
import controller from './private-database-task.controller';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.task', {
    url: '/task',
    template,
    controller,
    controllerAs: 'taskCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_task'),
    },
  });
};
