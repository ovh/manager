angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('pack.xdsl.tasks', {
    url: '/tasks',
    views: {
      'xdslView@pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/tasks/pack-xdsl-tasks.html',
        controller: 'XdslTasksCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: ['.'],
  });
});
