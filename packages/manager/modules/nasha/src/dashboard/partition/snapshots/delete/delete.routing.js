export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('nasha.dashboard.partition.snapshots.delete', {
    url: '/:customSnapshotName/delete',
    component: 'nashaComponentsPartitionSnapshotDelete',
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack, trackTasks) => ({
        error,
        tasks,
        ...otherParams
      } = {}) =>
        tasks ? trackTasks({ ...otherParams, tasks }) : goBack({ error }),
      customSnapshotName: /* @ngInject */ ($transition$) =>
        $transition$.params().customSnapshotName,
    },
  });
};
