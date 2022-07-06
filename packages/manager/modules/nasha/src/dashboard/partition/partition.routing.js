import { STATE_NAME } from './partition.constants';

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
      editDescriptionHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${STATE_NAME}.edit-description`, { serviceName }),
      editNameHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${STATE_NAME}.edit-name`, { serviceName }),
      editSizeHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${STATE_NAME}.edit-size`, { serviceName }),
      hasOperation: /* @ngInject */ (NashaTask, tasks) => (operation) =>
        tasks.filter(
          (task) => task.operation === NashaTask.operation[operation],
        ).length > 0,
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
      partitionApiUrl: /* @ngInject */ (serviceName, partitionName) =>
        `/dedicated/nasha/${serviceName}/partition/${partitionName}`,
      partitionName: /* @ngInject */ ($transition$) =>
        $transition$.params().partitionName,
      partitionHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(STATE_NAME, { serviceName }),
      tasks: /* @ngInject */ (
        iceberg,
        serviceName,
        partitionName,
        NashaTask,
        prepareTasks,
      ) =>
        iceberg(`/dedicated/nasha/${serviceName}/task`)
          .query()
          .expand('CachedObjectList-Pages')
          .addFilter('status', 'in', Object.values(NashaTask.status))
          .addFilter('partitionName', 'eq', partitionName)
          .execute(null, true)
          .$promise.then(({ data: tasks }) => prepareTasks(tasks)),
      ...goToEditResolve,
    },
  });
};
