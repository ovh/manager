export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.home.nat-ip-detail', {
    url: '/nat-ip-detail',
    views: {
      modal: {
        component: 'iplbNatIpDetail',
      },
    },
    layout: 'modal',
  });
};
