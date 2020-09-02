export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.veeam.restore', {
    url: '/restore',
    params: {
      restorePoint: null,
    },
    views: {
      modal: {
        component: 'vpsVeeamRestore',
      },
    },
    layout: 'modal',
    resolve: {
      restorePoint: /* @ngInject */ ($transition$) =>
        $transition$.params().restorePoint,
      breadcrumb: () => null,
    },
  });
};
