export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.volumes.dashboard.snapshots.restore', {
    url: '/restore',
    views: {
      modal: {
        component: 'ovhManagerNetAppVolumesDashboardSnapshotsRestoreComponent',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: /* @ngInject */ () => null,
    },
    atInternet: {
      rename: 'netapp::dashboard::volumes::dashboard::snapshots::restore',
    },
  });
};
