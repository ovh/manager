export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.backup-storage.add', {
    url: '/add',
    views: {
      modal: {
        component: 'vpsBackupStorageAdd',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
