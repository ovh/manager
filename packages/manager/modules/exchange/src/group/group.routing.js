import template from './group.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.group', {
    url: '/group',
    controller: 'ExchangeTabGroupsCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      goToAlias: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('exchange.dashboard.group.mailing-list.alias', {
          ...$transition$.params(),
          mailingList,
          address: mailingList.mailingListAddress,
        }),
      goToGroup: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('exchange.dashboard.group', $transition$.params()),
      goToManager: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('exchange.dashboard.group.mailing-list.manager', {
          ...$transition$.params(),
          mailingList,
          address: mailingList.mailingListAddress,
        }),
      goToMembers: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('exchange.dashboard.group.mailing-list.member', {
          ...$transition$.params(),
          mailingList,
          address: mailingList.mailingListAddress,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_group'),
    },
    onEnter: /* @ngInject */ (trackTab) => trackTab('group'),
    atInternet: {
      ignore: true,
    },
  });

  $stateProvider.state('exchange.dashboard.group.mailing-list', {
    url: '/:address',
    redirectTo: 'exchange.dashboard.group',
    template: '<div ui-view></div>',
    resolve: {
      address: /* @ngInject */ ($transition$) => $transition$.params().address,
      breadcrumb: /* @ngInject */ (address) => address,
    },
  });
};
