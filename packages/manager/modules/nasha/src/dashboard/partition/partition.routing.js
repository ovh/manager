import { createTaskTrackerStateOptions } from '../../components/task-tracker';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'nasha.dashboard.partition';
  const taskTrackerStateName = `${stateName}.task-tracker`;

  $stateProvider.state(stateName, {
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
          : goBack({ stateName, success, error }),
      editDescriptionHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${stateName}.edit-description`, { serviceName }),
      editSizeHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${stateName}.edit-size`, { serviceName }),
      goToEdit: /* @ngInject */ ($state, serviceName, partitionName) => (
        property,
      ) =>
        $state.go(`${stateName}.edit-${property}`, {
          serviceName,
          partitionName,
        }),
      goToEditDescription: /* @ngInject */ (goToEdit) => () =>
        goToEdit('description'),
      goToEditSize: /* @ngInject */ (goToEdit) => () => goToEdit('size'),
      isPartitionTabActive: /* @ngInject */ (
        currentHref,
        partitionHref,
        editDescriptionHref,
        editSizeHref,
      ) => () =>
        [partitionHref(), editDescriptionHref(), editSizeHref()].includes(
          currentHref(),
        ),
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
        $state.href(stateName, { serviceName }),
      goToTrackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(taskTrackerStateName, params),
    },
  });

  const {
    component,
    ...taskTrackerStateOptions
  } = createTaskTrackerStateOptions(['partitionName']);

  $stateProvider.state(taskTrackerStateName, {
    ...taskTrackerStateOptions,
    views: {
      edit: { component },
    },
  });
};
