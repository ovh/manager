export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.service-keys', {
    url: '/service-keys',
    component: 'cloudConnectServiceKeys',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      serviceKeys: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.loadServiceKeys(cloudConnect),
      goToRegenerateServiceKeyPage: /* @ngInject */ ($state) => (
        serviceKeyId,
      ) =>
        $state
          .go('cloud-connect.service-keys.regenerate-service-key', {
            serviceKeyId,
          }),
      goToServiceKeysPage: /* @ngInject */ (
        $state,
        CucControllerHelper,
        CucCloudMessage,
        cloudConnectId,
      ) => (message = false, type = 'success', reload = false) => {
        const state = 'cloud-connect.service-keys';
        const promise = $state.go(
          state,
          {
            ovhCloudConnectId: cloudConnectId,
          },
          {
            reload,
          },
        );
        if (message) {
          promise.then(() => CucCloudMessage[type](message, state));
          CucControllerHelper.scrollPageToTop();
        }
        return promise;
      },
    },
  });
};
