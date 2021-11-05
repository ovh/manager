export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.snapshotPolicies', {
    url: '/snapshotPolicies',
    views: {
      '@netapp.dashboard': {
        component: 'ovhManagerNetAppSnapshotPolicies',
      },
    },

    resolve: {
      goToCreateSnapshotPolicies: /* @ngInject */ ($state) => () =>
        $state.go('netapp.dashboard.snapshotPolicies.create'),
      snapshotPolicies: /* @ngInject */ (getSnapshotPolicies) =>
        getSnapshotPolicies(),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_snapshot_policies_breadcrumb'),
    },
  });
};
