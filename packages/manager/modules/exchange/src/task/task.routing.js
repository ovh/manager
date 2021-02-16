import template from './task.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.task', {
    url: '/task',
    controller: 'ExchangeTabTasksCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_task'),
    },
    onEnter: /* @ngInject */ (trackTab) => trackTab('task'),
    atInternet: {
      ignore: true,
    },
  });
};
