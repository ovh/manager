export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect', {
    url: '/cloud-connect/:ovhCloudConnectId',
    component: 'cloudConnect',
    redirectTo: 'cloud-connect.overview',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      cloudConnectId: /* @ngInject */ ($transition$) =>
        $transition$.params().ovhCloudConnectId,
      cloudConnect: /* @ngInject */ (cloudConnectService, cloudConnectId) =>
        cloudConnectService.getCloudConnect(cloudConnectId),
      user: /* @ngInject */ (OvhApiMe) => OvhApiMe.v6().get().$promise,
    },
  });
};
