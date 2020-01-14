export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.home.failover-ip', {
    url: '/failover-ip',
    views: {
      modal: {
        component: 'iplbFailoverIp',
      },
    },
    layout: 'modal',
  });
};
