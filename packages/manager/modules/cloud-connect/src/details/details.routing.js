export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details', {
    url: '/:ovhCloudConnectId',
    component: 'cloudConnectDetails',
    redirectTo: 'cloud-connect.details.overview',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      cloudConnectId: /* @ngInject */ ($transition$) =>
        $transition$.params().ovhCloudConnectId,
      cloudConnect: /* @ngInject */ (cloudConnectService, cloudConnectId) =>
        cloudConnectService.getCloudConnect(cloudConnectId),
      clearCache: /* @ngInject */ (cloudConnectService) => () =>
        cloudConnectService.clearAllCache(),
      breadcrumb: /* @ngInject */ (cloudConnectId) => cloudConnectId,
      notifications: /* @ngInject */ (cloudConnectId, cloudConnectService) =>
        cloudConnectService.getNotifications(cloudConnectId),
    },
  });
};
