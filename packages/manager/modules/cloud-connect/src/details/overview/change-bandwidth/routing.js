export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.change-bandwidth', {
    url: '/bandwidth/:serviceId/change',
    views: {
      modal: {
        component: 'cloudConnectDetailsChangeBandwidth',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      serviceId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceId,
      breadcrumb: () => null,
    },
  });
};
