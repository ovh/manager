export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.lock-port', {
    url: '/port/:interfaceId/lock',
    views: {
      modal: {
        component: 'cloudConnectLockPort',
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
