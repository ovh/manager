import { createTaskTrackerStateOptions } from '../../components/task-tracker';
import { STATE_NAME, TASK_TRACKER_STATE_NAME } from './partition.constants';

export default /* @ngInject */ ($stateProvider) => {
  const goToEditResolve = ['description', 'name', 'size'].reduce(
    (resolves, id) => {
      const capitalizedId = `${id[0].toUpperCase()}${id.slice(1)}`;
      return {
        ...resolves,
        [`goToEdit${capitalizedId}`]: /* @ngInject */ (
          $state,
          serviceName,
          partitionName,
        ) => () =>
          $state.go(`${STATE_NAME}.edit-${id}`, {
            serviceName,
            partitionName,
          }),
      };
    },
    {},
  );

  $stateProvider.state(STATE_NAME, {
    url: '/partition/:partitionName',
    views: {
      '@nasha': {
        component: 'nashaDashboardPartition',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ (partitionName) => partitionName,
      close: /* @ngInject */ (goBack, goToTrackTasks) => ({
        tasks,
        partitionName,
        success,
        error,
      } = {}) =>
        tasks
          ? goToTrackTasks({ tasks, partitionName })
          : goBack({ stateName: STATE_NAME, success, error }),
      editDescriptionHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${STATE_NAME}.edit-description`, { serviceName }),
      editNameHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${STATE_NAME}.edit-name`, { serviceName }),
      editSizeHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${STATE_NAME}.edit-size`, { serviceName }),
      partition: /* @ngInject */ (
        $state,
        serviceName,
        partitionName,
        partitions,
      ) => {
        const [partition] = partitions.filter(
          ({ partitionName: name }) => name === partitionName,
        );

        if (!partition) {
          return $state.go('nasha.dashboard', { serviceName });
        }

        return partition;
      },
      partitions: /* @ngInject */ (
        serviceName,
        preparePartition,
        OvhApiDedicatedNashaAapi,
      ) => {
        OvhApiDedicatedNashaAapi.resetCache();
        return OvhApiDedicatedNashaAapi.partitions({
          serviceName,
        }).$promise.then((partitions) => partitions.map(preparePartition));
      },
      partitionApiUrl: /* @ngInject */ (nashaApiUrl, partitionName) =>
        `${nashaApiUrl}/partition/${partitionName}`,
      partitionName: /* @ngInject */ ($transition$) =>
        $transition$.params().partitionName,
      partitionHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(STATE_NAME, { serviceName }),
      goToTrackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(TASK_TRACKER_STATE_NAME, params),
      ...goToEditResolve,
    },
  });

  const {
    component,
    ...taskTrackerStateOptions
  } = createTaskTrackerStateOptions(['partitionName']);

  $stateProvider.state(TASK_TRACKER_STATE_NAME, {
    ...taskTrackerStateOptions,
    views: {
      edit: { component },
    },
  });
};
