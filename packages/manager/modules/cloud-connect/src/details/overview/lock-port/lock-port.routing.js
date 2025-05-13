export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.lock-port', {
    url: '/port/:interfaceId/lock',
    views: {
      modal: {
        component: 'cloudConnectDetailsLockPort',
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
