export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('netapp.dashboard.snapshotPolicies.create', {
    url: '/create',
    views: {
      '@netapp.dashboard': {
        component: 'ovhManagerNetAppSnapshotPoliciesCreate',
      },
    },
    resolve: {
      goBackToSnapshotPolicies: /* @ngInject */ (
        $state,
        $translate,
        Alerter,
      ) => (successMessage) =>
        $state
          .go('netapp.dashboard.snapshotPolicies', null, { reload: true })
          .then(() => {
            Alerter.success(successMessage);
          }),
      breadcrumb: () => null,
    },
  });
};
