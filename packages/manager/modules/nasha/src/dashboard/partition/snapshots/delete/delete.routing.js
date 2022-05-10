export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.snapshots.delete', {
    url: '/:customSnapshotName/delete',
    component: 'nashaComponentsPartitionSnapshotDelete',
    resolve: {
      breadcrumb: () => null,
      customSnapshotName: /* @ngInject */ ($transition$) =>
        $transition$.params().customSnapshotName,
      close: /* @ngInject */ (goBack) => goBack,
      dismiss: /* @ngInject */ (goBack) => goBack,
    },
  });
};
