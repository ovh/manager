import { createTaskTrackerStateOptions } from '../../components/task-tracker';
import {
  INSTANCE_STATE_NAME,
  STATE_NAME,
  TASK_TRACKER_STATE_NAME,
} from './partitions.constants';

export default /* @ngInject */ ($stateProvider) => {
  const goToPagePartitionResolve = [
    { id: '', name: '' },
    { id: 'accesses', name: 'Accesses' },
    { id: 'snapshots', name: 'Snapshots' },
  ].reduce((resolve, { id, name }) => {
    const resolveName = `goToPagePartition${name}`;
    const stateName = `nasha.dashboard.partition${id ? `.${id}` : ''}`;
    return {
      ...resolve,
      [resolveName]: /* @ngInject */ ($state, serviceName) => (partitionName) =>
        $state.go(stateName, {
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
    const stateName = `${instance ? INSTANCE_STATE_NAME : STATE_NAME}.${id}`;
    return {
      ...resolve,
      [resolveName]: /* @ngInject */ ($state, serviceName) => (partition) =>
        $state.go(stateName, {
          serviceName,
          partitionName: partition?.partitionName,
          partition,
        }),
    };
  }, {});

  $stateProvider.state(STATE_NAME, {
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
          : goBack({ stateName: STATE_NAME, error }),
      partitionsHref: /* @ngInject */ ($state, serviceName) => () =>
        $state.href(STATE_NAME, { serviceName }),
      goToTrackTasks: /* @ngInject */ ($state) => (params) =>
        $state.go(TASK_TRACKER_STATE_NAME, params),
      urlRenew: /* @ngInject */ (serviceName, coreURLBuilder) =>
        coreURLBuilder.buildURL('dedicated', '#/billing/autoRenew', {
          selectedType: 'DEDICATED_NASHA',
          searchText: serviceName,
        }),
      ...goToPagePartitionResolve,
      ...goToTabPartitionsResolve,
    },
  });

  $stateProvider.state(
    TASK_TRACKER_STATE_NAME,
    createTaskTrackerStateOptions(['partitionName']),
  );

  $stateProvider.state(INSTANCE_STATE_NAME, {
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
