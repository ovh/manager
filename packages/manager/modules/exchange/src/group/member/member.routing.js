import template from './group-member.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.group.member', {
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
    },
  });
};
