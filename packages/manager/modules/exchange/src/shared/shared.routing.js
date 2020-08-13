import template from './shared.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.shared', {
    url: '/shared',
    controller: 'ExchangeTabPublicFolderCtrl',
    controllerAs: 'ctrl',
    template,
    resolve: {
      goToFolder: /* @ngInject */ ($state, $transition$) => () =>
        $state.href(
          'exchange.dashboard.shared.permission',
          $transition$.params(),
        ),
      goToShared: /* @ngInject */ ($state, $transition$) => () =>
        $state.href('exchange.dashboard.shared', $transition$.params()),
    },
  });
};
