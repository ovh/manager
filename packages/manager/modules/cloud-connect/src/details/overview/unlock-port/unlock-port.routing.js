export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.unlock-port', {
    url: '/port/:interfaceId/unlock',
    views: {
      modal: {
        component: 'cloudConnectDetailsUnlockPort',
      },
    },
    layout: 'modal',
    resolve: {
      interfaceId: /* @ngInject */ ($transition$) =>
        $transition$.params().interfaceId,
      interface: /* @ngInject */ (cloudConnect, interfaceId) =>
        cloudConnect.getInterface(interfaceId),
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      breadcrumb: () => null,
    },
  });
};
