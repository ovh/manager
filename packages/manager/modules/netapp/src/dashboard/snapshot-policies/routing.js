export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.snapshotPolicies', {
    url: '/snapshotPolicies',
    component: 'ovhManagerNetAppSnapshotPolicies',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('netapp_snapshot_policies_breadcrumb'),
    },
  });
};
