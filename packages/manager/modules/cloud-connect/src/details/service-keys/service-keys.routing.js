import {
  CLOUD_CONNECT_TRACKING_PREFIX,
  CLOUD_CONNECT_LISTING_TRACKING_CONTEXT,
} from '../../cloud-connect.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.service-keys', {
    url: '/service-keys',
    component: 'cloudConnectDetailsServiceKeys',
    atInternet: {
      rename: `${CLOUD_CONNECT_TRACKING_PREFIX}cloud-connect::dashboard::service-keys`,
      ...CLOUD_CONNECT_LISTING_TRACKING_CONTEXT,
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
