export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.shared.leaveSettings', {
    url: '',
    params: {
      model: null,
    },
    views: {
      modal: {
        component: 'managerHostingSharedLeaveSettings',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ ($state) => () => $state.go('^'),
      leave: /* @ngInject */ ($state) => () =>
        $state.go('app.hosting.dashboard.multisite'),

      model: /* @ngInject */ ($transition$) => $transition$.params().model,
    },
  });
};
