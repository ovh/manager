import { createTaskTrackerStateOptions } from '../../../components/task-tracker';
import { STATE_NAME, TASK_TRACKER_STATE_NAME } from './accesses.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(STATE_NAME, {
    url: '/accesses',
    component: 'nashaDashboardPartitionAccesses',
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack, trackTasks) => ({
        tasks,
        partitionName,
        ip,
        error,
      } = {}) =>
        tasks
          ? trackTasks({ tasks, partitionName, ip })
          : goBack({ stateName: STATE_NAME, error }),
      goToDelete: /* @ngInject */ ($state, serviceName, partitionName) => (
        ip,
      ) =>
        $state.go(`${STATE_NAME}.delete`, { serviceName, partitionName, ip }),
      trackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(TASK_TRACKER_STATE_NAME, params),
    },
  });

  $stateProvider.state(
    TASK_TRACKER_STATE_NAME,
    createTaskTrackerStateOptions(['partitionName', 'ip']),
  );
};
