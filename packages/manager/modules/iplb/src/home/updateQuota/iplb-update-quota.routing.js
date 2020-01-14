export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.home.update-quota', {
    url: '/update-quota',
    params: {
      quota: null,
    },
    views: {
      modal: {
        component: 'iplbUpdateQuota',
      },
    },
    layout: 'modal',
    resolve: {
      quota: /* @ngInject */ ($transition$) => $transition$.params().quota,
    },
  });
};
