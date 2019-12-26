export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.backup-storage.password', {
    url: '/password',
    params: {
      row: null,
    },
    views: {
      modal: {
        component: 'vpsBackupStoragePassword',
      },
    },
    layout: 'modal',
  });
};
