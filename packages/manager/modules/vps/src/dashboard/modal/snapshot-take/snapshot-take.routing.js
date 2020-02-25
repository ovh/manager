export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.dashboard.snapshot-take', {
    url: '/snapshot-take',
    views: {
      modal: {
        component: 'vpsDashboardSnapshotTake',
      },
    },
    layout: 'modal',
  });
};
