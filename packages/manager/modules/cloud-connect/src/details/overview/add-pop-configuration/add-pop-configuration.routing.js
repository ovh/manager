export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.add-pop', {
    url: '/pop/add',
    views: {
      modal: {
        component: 'cloudConnectDetailsAddPopConfiguration',
      },
    },
    layout: 'modal',
    translations: {
      value: ['.'],
      format: 'json',
    },
    params: {
      interfaceId: null,
      isDirectService: false,
      allowedPopType: null,
    },
    resolve: {
      interfaceId: /* @ngInject */ ($transition$) =>
        $transition$.params().interfaceId,
      isDirectService: /* @ngInject */ ($transition$) =>
        $transition$.params().isDirectService,
      allowedPopType: /* @ngInject */ ($transition$) =>
        $transition$.params().allowedPopType,
      popTypes: /* @ngInject */ (cloudConnectService) =>
        cloudConnectService.getAllPopTypes(),
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
    },
  });
};
