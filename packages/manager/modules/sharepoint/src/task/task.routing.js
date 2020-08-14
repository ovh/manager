import template from './TASK.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sharepoint.product.task', {
    url: '/task',
    template,
    controller: 'SharepointTasksCtrl',
    controllerAs: 'taskCtrl',
  });
};
