export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.dashboard.upgrade', {
    url: '/upgrade/:selectedUpgrade',
    views: {
      modal: {
        component: 'serverManualUpgrade',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      selectedUpgrade: /* @ngInject */ ($transition$) =>
        $transition$.params().selectedUpgrade,
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
    },
  });
};
