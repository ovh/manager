import template from './group.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.group', {
    url: '/group',
    controller: 'ExchangeTabGroupsCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      goToAlias: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('exchange.dashboard.group.alias', {
          ...$transition$.params(),
          mailingList,
        }),
      goToGroup: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('exchange.dashboard.group', $transition$.params()),
      goToManager: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('exchange.dashboard.group.manager', {
          ...$transition$.params(),
          mailingList,
        }),
      goToMembers: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('exchange.dashboard.group.member', {
          ...$transition$.params(),
          mailingList,
        }),
    },
  });
};
