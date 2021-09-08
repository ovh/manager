export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('anthos.dashboard.ips.order-public-ip', {
    url: '/order-public-ip',
    views: {
      modal: {
        component: 'orderPublicIp',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
