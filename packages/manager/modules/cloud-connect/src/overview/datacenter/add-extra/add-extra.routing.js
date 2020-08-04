export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.overview.datacenter-add-extra', {
    url: '/datacenter/:datacenterId/extra/add',
    views: {
      modal: {
        component: 'cloudConnectDatacenterAddExtra',
      },
    },
    translations: {
      value: ['.'],
      format: 'json',
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      datacenterId: /* @ngInject */ ($transition$) =>
        $transition$.params().datacenterId,
      datacenter: /* @ngInject */ (cloudConnect, datacenterId) =>
        cloudConnect.getDcConfiguration(datacenterId),
      popId: /* @ngInject */ (cloudConnect) =>
        cloudConnect.getFirstPopConfiguration().id,
      extraType: /* @ngInject */ (cloudConnect, datacenterId) =>
        cloudConnect.getDatacenterExtraType(datacenterId),
    },
  });
};
