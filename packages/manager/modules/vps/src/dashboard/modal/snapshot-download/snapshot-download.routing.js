export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.snapshot-download', {
    url: '/snapshot-download',
    views: {
      modal: {
        component: 'vpsSnapshotDownload',
      },
    },
    layout: 'modal',
  });
};
