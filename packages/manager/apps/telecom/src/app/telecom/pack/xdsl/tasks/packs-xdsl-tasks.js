angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.packs.pack.xdsl.tasks', {
    url: '/tasks',
    views: {
      'xdslView@telecom.packs.pack.xdsl': {
        templateUrl: 'app/telecom/pack/xdsl/tasks/pack-xdsl-tasks.html',
        controller: 'XdslTasksCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});
