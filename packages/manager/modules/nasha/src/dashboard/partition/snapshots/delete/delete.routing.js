export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.snapshots.delete', {
    url: '/:customSnapshotName/delete',
    component: 'nashaComponentsPartitionSnapshotDelete',
    resolve: {
      breadcrumb: () => null,
      customSnapshotName: /* @ngInject */ ($transition$) =>
        $transition$.params().customSnapshotName,
      close: /* @ngInject */ (goBack, trackTask) => ({
        taskIds,
        params,
      } = {}) => goBack().then(() => trackTask({ taskIds, params })),
      dismiss: /* @ngInject */ (goBack) => goBack,
    },
  });
};
