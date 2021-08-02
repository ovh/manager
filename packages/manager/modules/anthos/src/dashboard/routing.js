export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard', {
    url: '/:serviceName',
    component: 'Anthos',
    resolve: {
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
      dashboardLink: /* @ngInject */ ($state) =>
        $state.href('anthos.dashboard'),
      serviceName: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceName,
      breadcrumb: /* @ngInject */ (serviceName) => serviceName,
    },
  });
};
