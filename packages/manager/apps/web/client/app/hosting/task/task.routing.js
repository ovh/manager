import template from './TASK.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.task', {
    url: '/task',
    controller: 'HostingTabTasksCtrl',
    template,
  });
};
