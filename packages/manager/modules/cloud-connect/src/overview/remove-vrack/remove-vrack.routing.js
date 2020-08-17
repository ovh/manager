export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.remove-vrack', {
    url: '/vrack/:vRackId/remove',
    views: {
      modal: {
        component: 'cloudConnectRemoveVrack',
      },
    },
    layout: 'modal',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      vRackId: /* @ngInject */ ($transition$) => $transition$.params().vRackId,
    },
  });
};
