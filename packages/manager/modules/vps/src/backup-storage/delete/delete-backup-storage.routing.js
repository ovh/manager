export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.backup-storage.delete', {
    url: '/delete',
    params: {
      access: null,
    },
    views: {
      modal: {
        component: 'vpsBackupStorageDelete',
      },
    },
    layout: 'modal',
    resolve: {
      access: /* @ngInject */ ($transition$) => $transition$.params().access,
      breadcrumb: () => null,
    },
  });
};
