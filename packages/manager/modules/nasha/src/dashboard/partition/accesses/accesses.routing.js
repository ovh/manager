import { createTaskTrackerStateOptions } from '../../../components/task-tracker';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'nasha.dashboard.partition.accesses';
  const taskTrackerStateName = `${stateName}.task-tracker`;

  $stateProvider.state(stateName, {
    url: '/accesses',
    component: 'nashaDashboardPartitionAccesses',
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack, goToTrackTasks) => ({
        tasks,
        partitionName,
        ip,
        error,
      } = {}) =>
        tasks
          ? goToTrackTasks({ tasks, partitionName, ip })
          : goBack({ stateName, error }),
      goToDelete: /* @ngInject */ ($state, serviceName, partitionName) => (
        ip,
      ) => $state.go(`${stateName}.delete`, { serviceName, partitionName, ip }),
      goToTrackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(taskTrackerStateName, params),
    },
  });

  $stateProvider.state(
    taskTrackerStateName,
    createTaskTrackerStateOptions(['partitionName', 'ip']),
  );
};
