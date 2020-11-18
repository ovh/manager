export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.share', {
    url: '/share',
    component: 'netappShare',
    resolve: {
      netappId: /* @ngInject */ ($transition$) =>
        $transition$.params().netappId,
      shares: /* @ngInject */ (NetappService, netappId) =>
        NetappService.getShares(netappId),
    },
  });
};
