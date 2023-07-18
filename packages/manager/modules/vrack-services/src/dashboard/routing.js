export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dashboard', {
    url: '/:serviceName',
    component: 'vrackServices',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state) => $state.href('app.dashboard'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
