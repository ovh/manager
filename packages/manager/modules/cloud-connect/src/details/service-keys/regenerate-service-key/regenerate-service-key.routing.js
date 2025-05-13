export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(
    'cloud-connect.details.service-keys.regenerate-service-key',
    {
      url: '/service-key/:serviceKeyId/regenerate',
      views: {
        modal: {
          component: 'cloudConnectDetailsRegenerateServiceKey',
        },
      },
      layout: 'modal',
      resolve: {
        serviceKeyId: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceKeyId,
        serviceKey: /* @ngInject */ (cloudConnect) =>
          cloudConnect.getActiveServiceKey(),
        goBack: /* @ngInject */ (goToServiceKeysPage) => goToServiceKeysPage,
        breadcrumb: () => null,
      },
    },
  );
};
