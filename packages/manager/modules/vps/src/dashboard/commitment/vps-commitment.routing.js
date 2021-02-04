export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.commitment', {
    url: '/commitment?duration',
    views: {
      'vpsContent@vps.detail': 'billingCommitment',
    },
    resolve: {
      duration: /* @ngInject */ ($transition$) =>
        $transition$.params().duration,
      serviceId: /* @ngInject */ (serviceInfo) => serviceInfo.serviceId,
      me: /* @ngInject */ (connectedUser) => connectedUser,
    },
  });
};
