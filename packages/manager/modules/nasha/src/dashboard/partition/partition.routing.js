export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'nasha.dashboard.partition';

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
    onExit: /* @ngInject */ (Poller) => {
      Poller.kill({ namespace: stateName });
    },
    resolve: {
      breadcrumb: /* @ngInject */ (partitionName) => partitionName,
      editDescriptionHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${stateName}.edit-description`, { serviceName }),
      editNameHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${stateName}.edit-name`, { serviceName }),
      editSizeHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(`${stateName}.edit-size`, { serviceName }),
      hasOperation: /* @ngInject */ (NashaTask, partition) => (operation) =>
        partition.tasks.filter(
          (task) => task.operation === NashaTask.operation[operation],
        ).length,
      partition: /* @ngInject */ (
        $state,
        serviceName,
        partitionName,
        partitions,
        iceberg,
        reload,
        Poller,
        NashaTask,
      ) => {
        const [partition] = partitions.filter(
          ({ partitionName: name }) => name === partitionName,
        );

        if (!partition) {
          return $state.go('nasha.dashboard', { serviceName });
        }

        return iceberg(`/dedicated/nasha/${serviceName}/task`)
          .query()
          .expand('CachedObjectList-Pages')
          .addFilter('status', 'in', Object.values(NashaTask.status))
          .addFilter('partitionName', 'eq', partition.partitionName)
          .execute(null, true)
          .$promise.then(({ data: tasks }) => {
            const statuses = Object.values(NashaTask.status);
            partition.tasks = tasks;
            partition.polls = tasks.map(({ taskId }) =>
              Poller.poll(
                `/dedicated/nasha/${serviceName}/task/${taskId}`,
                null,
                {
                  namespace: stateName,
                  successRule: ({ status }) => !statuses.includes(status),
                },
              ).then(reload),
            );
          })
          .then(() => partition);
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
      partitionName: /* @ngInject */ ($transition$) =>
        $transition$.params().partitionName,
      partitionHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(stateName, { serviceName }),
      ...goToEditResolve,
    },
  });
};
