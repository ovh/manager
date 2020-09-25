import template from './dedicated-housing.html';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('dedicated-housing.dashboard', {
    url: '/:productId',
    template,
    controller: 'HousingCtrl',
    resolve: {
      name: /* @ngInject */ ($transition$) => $transition$.params().productId,

      dashboardLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('dedicated-housing.dashboard', $transition$.params()),
      backupLink: /* @ngInject */ ($transition$, $state) =>
        $state.href(
          'dedicated-housing.dashboard.backup',
          $transition$.params(),
        ),
      taskLink: /* @ngInject */ ($transition$, $state) =>
        $state.href('dedicated-housing.dashboard.task', $transition$.params()),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

    },
});
};
