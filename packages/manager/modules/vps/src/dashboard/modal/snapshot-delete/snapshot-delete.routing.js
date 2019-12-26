export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.snapshot-delete', {
    url: '/snapshot-delete',
    views: {
      modal: {
        component: 'vpsDashboardSnapshotDelete',
      },
    },
    layout: 'modal',
  });
};
