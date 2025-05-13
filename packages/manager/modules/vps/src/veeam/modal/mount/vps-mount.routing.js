export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.veeam.mount', {
    params: {
      mount: null,
      restorePoint: null,
    },
    url: '/mount',
    views: {
      modal: {
        component: 'vpsVeeamMount',
      },
    },
    layout: 'modal',
    resolve: {
      mount: /* @ngInject */ ($transition$) => $transition$.params().mount,
      restorePoint: /* @ngInject */ ($transition$) =>
        $transition$.params().restorePoint,
      breadcrumb: () => null,
    },
  });
};
