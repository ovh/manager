import { createTaskTrackerStateOptions } from '../../../components/task-tracker';
import { STATE_NAME } from './snapshots.constants';

export default /* @ngInject */ ($stateProvider) => {
  const snapshotEnumKey = 'dedicated.storage.SnapshotEnum';

  $stateProvider.state(STATE_NAME, {
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
        prepareSnapshots,
        customSnapshots,
        snapshotEnum,
      ) =>
        $http
          .get(`${partitionApiUrl}/snapshot`)
          .then(({ data: snapshots }) =>
            prepareSnapshots(snapshots, customSnapshots, snapshotEnum),
          ),
      snapshotEnum: /* @ngInject */ (schema) =>
        schema.models[snapshotEnumKey].enum,
      trackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(`${STATE_NAME}.task-tracker`, params),
    },
  });

  $stateProvider.state(
    `${STATE_NAME}.task-tracker`,
    createTaskTrackerStateOptions(['partitionName', 'customSnapshotName']),
  );
};
