import { DIAGNOSTIC_TRACKING_PREFIX } from '../../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.service-keys', {
    url: '/service-keys',
    component: 'cloudConnectDetailsServiceKeys',
    atInternet: {
      rename: `${DIAGNOSTIC_TRACKING_PREFIX}cloud-connect::dashboard::service-keys`,
      level2: 99,
    },
    resolve: {
      serviceKeys: /* @ngInject */ (cloudConnectService, cloudConnect) =>
        cloudConnectService.loadServiceKeys(cloudConnect),
      goToRegenerateServiceKeyPage: /* @ngInject */ ($state) => (
        serviceKeyId,
      ) =>
        $state.go('cloud-connect.details.service-keys.regenerate-service-key', {
          serviceKeyId,
        }),
      goToServiceKeysPage: /* @ngInject */ (
        $state,
        CucControllerHelper,
        CucCloudMessage,
        cloudConnectId,
      ) => (message = false, type = 'success', reload = false) => {
        const state = 'cloud-connect.details.service-keys';
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
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('cloud_connect_service_keys'),
    },
  });
};
