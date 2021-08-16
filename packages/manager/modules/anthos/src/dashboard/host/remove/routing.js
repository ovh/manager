export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.host.remove', {
    url: '/remove',
    params: {
      host: null,
    },
    views: {
      modal: {
        component: 'anthosRemoveHost',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
      goBack: /* @ngInject */ (goToHost) => (message, type) =>
        goToHost(message, type),
      host: /* @ngInject */ ($transition$) => $transition$.params().host,
      hostService: /* @ngInject */ (AnthosTenantsService, host, serviceName) =>
        AnthosTenantsService.getHostService(serviceName, host.id),
    },
  });
};
