import template from './group-member.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.group.mailing-list.member', {
    url: '/member',
    controller: 'ExchangeTabMembersByGroupsCtrl',
    controllerAs: 'ctrl',
    template,
    params: {
      mailingList: {},
    },
    resolve: {
      mailingList: /* @ngInject */ ($transition$) =>
        $transition$.params().mailingList,
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_group_member'),
    },
  });
};
