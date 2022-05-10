export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'nasha.dashboard.partition.snapshots';
  const snapshotEnumKey = 'dedicated.storage.SnapshotEnum';

  $stateProvider.state(stateName, {
    url: '/snapshots',
    component: 'nashaDashboardPartitionSnapshots',
    resolve: {
      breadcrumb: () => null,
      customSnapshots: /* @ngInject */ ($http, partitionApiUrl) =>
        $http.get(`${partitionApiUrl}/customSnapshot`).then(({ data }) => data),
      goToDelete: /* @ngInject */ ($state, serviceName, partitionName) => (
        customSnapshotName,
      ) =>
        $state.go('nasha.dashboard.partition.snapshots.delete', {
          serviceName,
          partitionName,
          customSnapshotName,
        }),
      snapshots: /* @ngInject */ (
        $http,
        partitionApiUrl,
        preparePartitionSnapshots,
        partition,
        customSnapshots,
        snapshotEnum,
        tasks,
      ) =>
        $http
          .get(`${partitionApiUrl}/snapshot`)
          .then(({ data: snapshots }) =>
            preparePartitionSnapshots(
              partition,
              snapshots,
              customSnapshots,
              snapshotEnum,
              tasks,
            ),
          ),
      snapshotEnum: /* @ngInject */ (schema) =>
        schema.models[snapshotEnumKey].enum,
    },
  });
};
