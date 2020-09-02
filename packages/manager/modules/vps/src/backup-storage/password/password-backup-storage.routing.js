export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.backup-storage.password', {
    url: '/password',
    views: {
      modal: {
        component: 'vpsBackupStoragePassword',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
