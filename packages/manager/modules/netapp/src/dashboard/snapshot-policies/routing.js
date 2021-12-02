export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.snapshotPolicies', {
    url: '/snapshotPolicies',
    views: {
      '@netapp.dashboard': {
        component: 'ovhManagerNetAppSnapshotPolicies',
      },
    },

    resolve: {
      goToCreateSnapshotPolicies: /* @ngInject */ (
        $state,
        trackClick,
      ) => () => {
        trackClick('snapshot-policy::add-policy');
        return $state.go('netapp.dashboard.snapshotPolicies.create');
      },
      snapshotPolicies: /* @ngInject */ (getSnapshotPolicies) =>
        getSnapshotPolicies(),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_snapshot_policies_breadcrumb'),
    },
    atInternet: {
      rename: 'netapp::dashboard::snapshot-policy',
    },
  });
};
