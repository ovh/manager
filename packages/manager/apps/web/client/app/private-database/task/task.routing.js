import template from './private-database-task.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.private-database.dashboard.task', {
    url: '/task',
    template,
    controller: 'PrivateDatabaseTasksCtrl',
    controllerAs: 'taskCtrl',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('private_database_task'),
    },
  });
};
