export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.remove-vrack', {
    url: '/vrack/:vRackId/remove',
    views: {
      modal: {
        component: 'cloudConnectDetailsRemoveVrack',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      vRackId: /* @ngInject */ ($transition$) => $transition$.params().vRackId,
      breadcrumb: () => null,
    },
  });
};
