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
          group: mailingList.mailingListAddress,
        }),
      goToGroup: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('exchange.dashboard.group', $transition$.params()),
      goToManager: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('exchange.dashboard.group.mailing-list.manager', {
          ...$transition$.params(),
          group: mailingList.mailingListAddress,
        }),
      goToMembers: /* @ngInject */ ($state, $transition$) => (mailingList) =>
        $state.go('exchange.dashboard.group.mailing-list.member', {
          ...$transition$.params(),
          group: mailingList.mailingListAddress,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_group'),
    },
  });

  $stateProvider.state('exchange.dashboard.group.mailing-list', {
    url: '/:group',
    redirectTo: 'exchange.dashboard.group',
    template: '<div ui-view></div>',
    resolve: {
      breadcrumb: /* @ngInject */ ($transition$) => $transition$.params().group,
    },
  });
};
