export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.remove-extra', {
    url: '/datacenter/:datacenterId/extra/:extraId/remove',
    views: {
      modal: {
        component: 'cloudConnectRemoveExtra',
      },
    },
    layout: 'modal',
    translations: {
      value: ['.'],
      format: 'json',
    },
    resolve: {
      datacenterId: /* @ngInject */ ($transition$) =>
        $transition$.params().datacenterId,
      datacenter: /* @ngInject */ (cloudConnect, datacenterId) =>
        cloudConnect.getDcConfiguration(datacenterId),
      popId: /* @ngInject */ (cloudConnect) =>
        cloudConnect.getFirstPopConfiguration().id,
      extraId: /* @ngInject */ ($transition$) => $transition$.params().extraId,
      extra: /* @ngInject */ (datacenter, extraId) =>
        datacenter.getExtraConfiguration(extraId),
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
    },
  });
};
