import { createTaskTrackerStateOptions } from '../../components/task-tracker';

export default /* @ngInject */ ($stateProvider) => {
  const stateName = 'nasha.dashboard.partitions';
  const instanceStateName = `${stateName}.partition`;
  const taskTrackerStateName = `${stateName}.task-tracker`;

  const goToPagePartitionResolve = [
    { id: '', name: '' },
    { id: 'accesses', name: 'Accesses' },
    { id: 'snapshots', name: 'Snapshots' },
  ].reduce((resolve, { id, name }) => {
    const resolveName = `goToPagePartition${name}`;
    const pageStateName = `nasha.dashboard.partition${id ? `.${id}` : ''}`;
    return {
      ...resolve,
      [resolveName]: /* @ngInject */ ($state, serviceName) => (partitionName) =>
        $state.go(pageStateName, {
          serviceName,
          partitionName,
        }),
    };
  }, {});

  const goToTabPartitionsResolve = [
    { id: 'create', name: 'Create', instance: false },
    { id: 'delete', name: 'Delete', instance: true },
    { id: 'edit-size', name: 'EditSize', instance: true },
    { id: 'zfs-options', name: 'ZfsOptions', instance: true },
  ].reduce((resolve, { id, name, instance }) => {
    const resolveName = `goToTabPartitions${name}`;
    const tabStateName = `${instance ? instanceStateName : stateName}.${id}`;
    return {
      ...resolve,
      [resolveName]: /* @ngInject */ ($state, serviceName) => (partition) =>
        $state.go(tabStateName, {
          serviceName,
          partitionName: partition?.partitionName,
          partition,
        }),
    };
  }, {});

  $stateProvider.state(stateName, {
    url: '/partitions',
    component: 'nashaDashboardPartitions',
    resolve: {
      breadcrumb: () => null,
      close: /* @ngInject */ (goBack, goToTrackTasks) => ({
        tasks,
        partitionName,
        error,
      } = {}) =>
        tasks
          ? goToTrackTasks({ tasks, partitionName })
          : goBack({ stateName, error }),
      goToTrackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(taskTrackerStateName, params),
      urlRenew: /* @ngInject */ (serviceName, coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew', {
          selectedType: 'DEDICATED_NASHA',
          searchText: serviceName,
        }),
      ...goToPagePartitionResolve,
      ...goToTabPartitionsResolve,
    },
    atInternet: {
      rename: 'nasha::dashboard::nasha-partitions',
    },
  });

  $stateProvider.state(
    taskTrackerStateName,
    createTaskTrackerStateOptions(['partitionName']),
  );

  $stateProvider.state(instanceStateName, {
    abstract: true,
    url: '/:partitionName',
    params: {
      partition: null,
    },
    resolve: {
      breadcrumb: () => null,
      partition: /* @ngInject */ ($transition$, $http, partitionApiUrl) =>
        $transition$.params().partition ||
        $http.get(partitionApiUrl).then(({ data }) => data),
      partitionApiUrl: /* @ngInject */ (nashaApiUrl, partitionName) =>
        `${nashaApiUrl}/partition/${partitionName}`,
      partitionName: /* @ngInject */ ($transition$) =>
        $transition$.params().partitionName,
    },
  });
};
