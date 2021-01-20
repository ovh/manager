export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp', {
    url: '/netapp/:netappId',
    component: 'netapp',
    resolve: {
      netappId: /* @ngInject */ ($transition$) =>
        $transition$.params().netappId,
      service: /* @ngInject */ (NetappService, netappId) =>
        NetappService.getService(netappId),
      serviceLink: /* @ngInject */ ($state, netappId) =>
        $state.href('netapp', {
          netappId,
        }),
      shareLink: /* @ngInject */ ($state, netappId) =>
        $state.href('netapp.share', {
          netappId,
        }),
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),
    },
  });
};
