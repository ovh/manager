export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('cloud-connect.details.overview.datacenter-add', {
    url: '/datacenter/add',
    views: {
      modal: {
        component: 'cloudConnectDetailsDatacenterAdd',
      },
    },
    layout: 'modal',
    resolve: {
      goBack: /* @ngInject */ (goToCloudConnectPage) => goToCloudConnectPage,
      popId: /* @ngInject */ (cloudConnect) =>
        cloudConnect.getFirstPopConfiguration().id,
      breadcrumb: () => null,
    },
  });
};
