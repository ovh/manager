export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.share', {
    url: '/share',
    component: 'netappShare',
    resolve: {
      shares: /* @ngInject */ (NetappService, netappId) =>
        NetappService.getShares(netappId),
    },
  });
};
