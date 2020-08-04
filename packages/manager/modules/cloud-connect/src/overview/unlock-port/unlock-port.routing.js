export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.overview.unlock-port', {
    url: '/port/:interfaceId/unlock',
    views: {
      modal: {
        component: 'cloudConnectUnlockPort',
      },
    },
    layout: 'modal',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      interfaceId: /* @ngInject */ ($transition$) =>
        $transition$.params().interfaceId,
      interface: /* @ngInject */ (cloudConnect, interfaceId) =>
        cloudConnect.getInterface(interfaceId),
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
    },
  });
};
