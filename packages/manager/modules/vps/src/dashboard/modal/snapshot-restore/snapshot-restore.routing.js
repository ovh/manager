export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.snapshot-restore', {
    url: '/snapshot-restore',
    views: {
      modal: {
        component: 'vpsDashboardSnapshotRestore',
      },
    },
    layout: 'modal',
  });
};
