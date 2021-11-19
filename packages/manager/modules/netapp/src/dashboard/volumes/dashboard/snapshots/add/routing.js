export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.snapshots.add', {
    url: '/add',
    views: {
      modal: {
        component: 'ovhManagerNetAppVolumesDashboardSnapshotsAdd',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
    },
  });
};
