import { createTaskTrackerStateOptions } from '../../../components/task-tracker';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'nasha.dashboard.partition.snapshots';
  const taskTrackerStateName = `${stateName}.task-tracker`;

  $stateProvider.state(stateName, {
    url: '/snapshots',
    component: 'nashaDashboardPartitionSnapshots',
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack, trackTasks) => ({
        tasks,
        partitionName,
        customSnapshotName,
        error,
      } = {}) =>
        tasks
          ? trackTasks({ tasks, partitionName, customSnapshotName })
          : goBack({ stateName, error }),
      customSnapshots: /* @ngInject */ ($http, partitionApiUrl) =>
        $http.get(`${partitionApiUrl}/customSnapshot`).then(({ data }) => data),
      goToDelete: /* @ngInject */ ($state, serviceName, partitionName) => (
        customSnapshotName,
      ) =>
        $state.go(`${stateName}.delete`, {
          serviceName,
          partitionName,
          customSnapshotName,
        }),
      snapshotTypes: /* @ngInject */ ($http, partitionApiUrl) =>
        $http.get(`${partitionApiUrl}/snapshot`).then(({ data }) => data),
      trackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(taskTrackerStateName, params),
    },
  });

  $stateProvider.state(
    taskTrackerStateName,
    createTaskTrackerStateOptions(['partitionName', 'customSnapshotName']),
  );
};
