import { createTaskTrackerStateOptions } from '../../../components/task-tracker';
import { STATE_NAME } from './accesses.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state(STATE_NAME, {
    url: '/accesses',
    component: 'nashaDashboardPartitionAccesses',
    resolve: {
      breadcrumb: () => null,
      aclTypeEnum: (schema) =>
        schema.models['dedicated.storage.AclTypeEnum'].enum,
      goToDelete: /* @ngInject */ ($state, serviceName, partitionName) => (
        ip,
      ) =>
        $state.go(`${STATE_NAME}.delete`, { serviceName, partitionName, ip }),
      trackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(`${STATE_NAME}.task-tracker`, params),
    },
  });

  $stateProvider.state(
    `${STATE_NAME}.task-tracker`,
    createTaskTrackerStateOptions(['partitionName', 'ip']),
  );
};
