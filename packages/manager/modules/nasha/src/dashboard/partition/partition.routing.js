import { createTaskTrackerStateOptions } from '../../components/task-tracker';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'nasha.dashboard.partition';
  const taskTrackerStateName = `${stateName}.task-tracker`;

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
          $state.go(`${stateName}.edit-${id}`, {
            serviceName,
            partitionName,
          }),
      };
    },
    {},
  );

  $stateProvider.state(stateName, {
    url: '/partition/:partitionName',
    views: {
      '@nasha': {
        component: 'nashaDashboardPartition',
      },
    },
    resolve: {
      breadcrumb: /* @ngInject */ (partitionName) => partitionName,
      close: /* @ngInject */ (goBack, trackTasks) => ({
        tasks,
        partitionName,
        success,
        error,
      } = {}) =>
        tasks
          ? trackTasks({ tasks, partitionName })
          : goBack({ stateName, success, error }),
      editDescriptionHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${stateName}.edit-description`, { serviceName }),
      editNameHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${stateName}.edit-name`, { serviceName }),
      editSizeHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${stateName}.edit-size`, { serviceName }),
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
      trackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(taskTrackerStateName, params),
      ...goToEditResolve,
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
