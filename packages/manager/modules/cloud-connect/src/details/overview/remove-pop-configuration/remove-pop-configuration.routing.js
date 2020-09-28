export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.remove-pop', {
    url: '/pop/:popId/remove',
    views: {
      modal: {
        component: 'cloudConnectDetailsRemovePopConfiguration',
      },
    },
    layout: 'modal',
    translations: {
      value: ['.'],
      format: 'json',
    },
    params: {
      interfaceId: false,
    },
    resolve: {
      popId: /* @ngInject */ ($transition$) => $transition$.params().popId,
      interfaceId: /* @ngInject */ ($transition$) =>
        $transition$.params().interfaceId,
      pop: /* @ngInject */ (cloudConnect, interfaceId) =>
        cloudConnect.getPopConfiguration(interfaceId),
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
    },
  });
};
