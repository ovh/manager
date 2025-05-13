export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.backup-storage.edit', {
    url: '/edit',
    params: {
      row: null,
    },
    views: {
      modal: {
        component: 'vpsBackupStorageEdit',
      },
    },
    layout: 'modal',
    resolve: {
      row: /* @ngInject */ ($transition$) => $transition$.params().row,
      breadcrumb: () => null,
    },
  });
};
