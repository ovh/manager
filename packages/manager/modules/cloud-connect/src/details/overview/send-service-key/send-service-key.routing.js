export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.send-service-key', {
    url: '/service-key/:serviceKeyId/send',
    views: {
      modal: {
        component: 'cloudConnectDetailsSendServiceKey',
      },
    },
    layout: 'modal',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      serviceKeyId: /* @ngInject */ ($transition$) =>
        $transition$.params().serviceKeyId,
      serviceKey: /* @ngInject */ (cloudConnect) =>
        cloudConnect.getActiveServiceKey(),
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
    },
  });
};
