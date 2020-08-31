import find from 'lodash/find';
import findIndex from 'lodash/findIndex';
import flatten from 'lodash/flatten';
import forEach from 'lodash/forEach';
import includes from 'lodash/includes';
import map from 'lodash/map';
import remove from 'lodash/remove';
import set from 'lodash/set';
import some from 'lodash/some';

export default class NashaPartitionCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $translate,
    CucCloudMessage,
    OvhApiDedicatedNasha,
    Poller,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
    this.Poller = Poller;

    this.trackedTaskStatus = ['todo', 'doing'];
    this.trackedTaskOperations = [
      'clusterLeclercPartitionAdd',
      'clusterLeclercPartitionDelete',
      'clusterLeclercPartitionUpdate',
      'clusterLeclercSnapshotUpdate',
      'clusterLeclercCustomSnapCreate',
      'clusterLeclercZfsOptions',
    ];
    // object that contain tasks for each partition
    // e.g. [
    //   {
    //     partitionName: "partition123",
    //     tasks: [65564, 78329]
    //   }, {
    //     partitionName: "partitionABC",
    //     tasks: [9998,9999]
    //   },
    // ]
    this.data = {
      partitionsTasks: {},
      nasha: null,
      table: {
        partitionIds: [],
        partitionsInCreation: [],
        currentPartitions: [],
        refresh: false,
      },
    };

    this.loaders = {
      table: false,
    };

    $scope.$on('$destroy', () => {
      this.Poller.kill({ namespace: 'nasha.dashboard.partition' });
    });
  }

  $onInit() {
    if (this.task) {
      this.initTasks();
    }
    this.load();
  }

  getTasksPromise(status) {
    return this.OvhApiDedicatedNasha.Task()
      .v6()
      .query({ serviceName: this.serviceName, status }).$promise;
  }

  buildPartitionsInCreation(task, accumulator) {
    if (task.operation === 'clusterLeclercPartitionAdd') {
      const partition = find(
        this.data.table.partitionIds,
        (partitionId) => task.partitionName === partitionId,
      );

      if (!partition) {
        this.data.table.partitionIds.unshift(task.partitionName);
        this.data.table.partitions.unshift({
          partitionName: task.partitionName,
        });
      }

      accumulator.push({ partitionName: task.partitionName });
    }
  }

  buildPartitionsTasks(task, accumulator) {
    if (includes(this.trackedTaskOperations, task.operation)) {
      if (accumulator[task.partitionName] === undefined) {
        accumulator[task.partitionName] = [task];
      }
    }
  }

  launchPolling(taskId) {
    return this.Poller.poll(
      `/dedicated/nasha/${this.data.nasha.serviceName}/task/${taskId}`,
      null,
      {
        successRule(task) {
          return task.status === 'done';
        },
        errorRule(task) {
          return ['doing', 'todo', 'done'].indexOf(task.status) === -1;
        },
        namespace: 'nasha.dashboard.partition',
      },
    );
  }

  initPartitions(resetCache) {
    this.data.table.partitionsInCreation = [];
    if (resetCache) {
      this.OvhApiDedicatedNasha.Aapi().resetAllCache();
    }

    return this.OvhApiDedicatedNasha.Aapi()
      .partitions({ serviceName: this.serviceName })
      .$promise.then((partitions) => {
        this.data.table.partitions = map(
          partitions,
          (partition) => partition.partitionName,
        );
        this.data.table.partitionIds = this.data.table.partitions;

        this.data.table.partitions = map(partitions, (partition) => {
          forEach(partition.use, (part, key) => {
            set(
              part,
              'name',
              this.$translate.instant(`nasha_storage_usage_type_${key}`),
            );
          });
          return partition;
        });
      });
  }

  pollPartitionTask(task) {
    this.launchPolling(task.taskId).finally(() => {
      this.initPartitions(true)
        .then(() => {
          const taskIndex = findIndex(
            this.data.partitionsTasks[task.partitionName],
            (partitionTask) => task.taskId === partitionTask.taskId,
          );

          if (taskIndex > -1) {
            this.data.partitionsTasks[task.partitionName].splice(taskIndex, 1);
          }
        })
        .catch((err) => {
          this.CucCloudMessage.error(
            this.$translate.instant('nasha_partitions_no_data_error'),
          );
          return this.$q.reject(err);
        });
    });
  }

  initTasks() {
    this.OvhApiDedicatedNasha.Task()
      .v6()
      .resetCache();

    const tasksPromises = map(this.trackedTaskStatus, (status) =>
      this.getTasksPromise(status),
    );

    return this.$q
      .all(tasksPromises)
      .then((data) => flatten(data))
      .then((taskIds) => {
        const taskPromises = map(
          taskIds,
          (taskId) =>
            this.OvhApiDedicatedNasha.Task()
              .v6()
              .get({ serviceName: this.serviceName, taskId }).$promise,
        );

        return this.$q.all(taskPromises);
      })
      .then((taskObjects) => {
        // We don't wipe this.data.partitionsTasks right away because we don't want the spinners
        // to disapear while we reload.
        const partitionsTasksAccumulator = {};
        this.data.table.partitionsInCreation = [];
        forEach(taskObjects, (taskObject) => {
          this.buildPartitionsInCreation(
            taskObject,
            this.data.table.partitionsInCreation,
          );
          this.buildPartitionsTasks(taskObject, partitionsTasksAccumulator);
          this.pollPartitionTask(taskObject);
        });
        this.data.partitionsTasks = partitionsTasksAccumulator;
        return this.$q.when(taskObjects);
      });
  }

  initNasha() {
    return this.OvhApiDedicatedNasha.Aapi()
      .get({ serviceName: this.serviceName })
      .$promise.then((nasha) => {
        this.data.nasha = nasha;
      });
  }

  load(resetCache) {
    this.loaders.table = true;
    this.$q
      .all([this.initNasha(), this.initPartitions()])
      .then(() => this.initTasks())
      .then(() => {
        if (resetCache) {
          this.data.table.refresh = !this.data.table.refresh;
        }
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant('nasha_partitions_no_data_error'),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.table = false;
      });
  }

  hasTaskInProgress(partition) {
    return some(this.data.partitionsTasks[partition.partitionName]);
  }

  updatePartition(partition) {
    return this.getPartition(partition.partitionName)
      .then((updatedPartition) => {
        set(partition, 'size', updatedPartition.size);
      })
      .catch((data) => {
        // partition is not found, probably deleted
        if (data.status === 404) {
          remove(
            this.data.table.partitionIds,
            (item) => item === partition.partitionName,
          );
        } else {
          return this.$q.reject(data);
        }
        return null;
      });
  }

  goToNashaPartitionAccess(partitionName) {
    this.$state.go('nasha.dashboard.partition.nasha-partition-access', {
      partitionName,
    });
  }
}
