import { createTaskTrackerStateOptions } from '../../../components/task-tracker';
import { STATE_NAME, TASK_TRACKER_STATE_NAME } from './snapshots.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(STATE_NAME, {
    url: '/snapshots',
    component: 'nashaDashboardPartitionSnapshots',
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack, goToTrackTasks) => ({
        tasks,
        partitionName,
        customSnapshotName,
        error,
      } = {}) =>
        tasks
          ? goToTrackTasks({ tasks, partitionName, customSnapshotName })
          : goBack({ stateName: STATE_NAME, error }),
      customSnapshots: /* @ngInject */ ($http, partitionApiUrl) =>
        $http.get(`${partitionApiUrl}/customSnapshot`).then(({ data }) => data),
      goToDelete: /* @ngInject */ ($state, serviceName, partitionName) => (
        customSnapshotName,
      ) =>
        $state.go(`${STATE_NAME}.delete`, {
          serviceName,
          partitionName,
          customSnapshotName,
        }),
      snapshotTypes: /* @ngInject */ ($http, partitionApiUrl) =>
        $http.get(`${partitionApiUrl}/snapshot`).then(({ data }) => data),
      goToTrackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(TASK_TRACKER_STATE_NAME, params),
    },
  });

  $stateProvider.state(
    TASK_TRACKER_STATE_NAME,
    createTaskTrackerStateOptions(['partitionName', 'customSnapshotName']),
  );
};
