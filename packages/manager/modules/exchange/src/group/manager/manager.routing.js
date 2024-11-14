import template from './group-manager.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.group.mailing-list.manager', {
    url: '/manager',
    controller: 'ExchangeTabManagersByGroupsCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_group_manager'),
    },
  });
};
