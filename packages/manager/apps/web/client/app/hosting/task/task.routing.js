import template from './TASK.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.task', {
    url: '/task',
    controller: 'HostingTabTasksCtrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('hosting_tasks'),
    },
  });
};
