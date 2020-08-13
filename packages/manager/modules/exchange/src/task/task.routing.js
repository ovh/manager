import template from './task.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.task', {
    url: '/task',
    controller: 'ExchangeTabTasksCtrl',
    controllerAs: 'ctrl',
    template,
  });
};
