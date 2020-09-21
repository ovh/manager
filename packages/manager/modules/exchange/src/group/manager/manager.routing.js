import template from './group-manager.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.group.mailing-list.manager', {
    url: '/manager',
    controller: 'ExchangeTabManagersByGroupsCtrl',
    controllerAs: 'ctrl',
    template,
    params: {
      mailingList: {},
    },
    resolve: {
      mailingList: /* @ngInject */ ($transition$) =>
        $transition$.params().mailingList,
    },
  });
};
