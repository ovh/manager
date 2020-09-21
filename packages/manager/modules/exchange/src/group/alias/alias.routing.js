import template from './group-alias.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.group.mailing-list.alias', {
    url: '/alias',
    controller: 'ExchangeTabGroupAliasCtrl',
    controllerAs: 'ctrl',
    template,
    params: {
      mailingList: {},
    },
    resolve: {
      mailingList: /* @ngInject */ ($transition$) =>
        $transition$.params().mailingList,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_group_alias'),
    },
  });
};
