export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.hosting.dashboard.cdn.flush', {
    url: '/flush?domain',
    layout: 'modal',
    views: {
      modal: {
        component: 'hostingFlushCdnComponent',
      },
    },
    resolve: {
      domain: /* @ngInject */ ($transition$) => $transition$.params().domain,
      goBack: /* @ngInject */ ($state, Alerter) => (
        message,
        type = 'success',
      ) =>
        $state.go('app.hosting.dashboard.multisite').then(() => {
          Alerter[type](message, 'app.alerts.main');
        }),
      onFlushSuccess: /* @ngInject */ ($rootScope) => () =>
        $rootScope.$broadcast('hosting.cdn.flush.refresh'),
    },
  });
};
