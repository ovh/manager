import find from 'lodash/find';
import remove from 'lodash/remove';
import some from 'lodash/some';

export default class NashaPartitionAccessCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $state,
    $translate,
    CucCloudMessage,
    Poller,
    OvhApiDedicatedNasha,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.Poller = Poller;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;

    this.data = {
      nasha: {},
      partition: {},
      addAccessInProgress: [],
      taskForAccess: [],
    };

    this.table = {
      accessIps: [],
      refresh: false,
    };

    this.loaders = {
      table: false,
    };

    $scope.$on('$destroy', () => {
      this.Poller.kill({ namespace: 'nasha.access' });
    });
  }

  $onInit() {
    if (this.task) {
      this.pollTasksForAccess(this.access, this.task);
      this.data.taskForAccess.push({ task: this.task, access: this.access });
    }
    this.load();
  }

  load(resetCache) {
    this.loaders.table = true;
    if (resetCache) {
      this.OvhApiDedicatedNasha.Partition().Access().v6().resetCache();
    }

    this.$q
      .all({
        nasha: this.OvhApiDedicatedNasha.v6().get({
          serviceName: this.serviceName,
        }).$promise,
        accesses: this.OvhApiDedicatedNasha.Partition().Access().v6().query({
          serviceName: this.serviceName,
          partitionName: this.partition,
        }).$promise,
      })
      .then((data) => {
        this.data.nasha = data.nasha;
        this.data.partition = this.partitionDetails;
        this.table.accessIps = data.accesses.map((ip) => ({
          ip,
        }));
        if (resetCache) {
          this.table.refresh = !this.table.refresh;
        }
        if (this.isNew) {
          this.table.accessIps.push(this.access);
          this.data.addAccessInProgress.push(this.access);
        }
      })
      .catch((err) => {
        this.CucCloudMessage.error(
          this.$translate.instant('nasha_partitions_access_no_data_error'),
        );
        return this.$q.reject(err);
      })
      .finally(() => {
        this.loaders.table = false;
      });
  }

  getAccessForIp(accessIp) {
    // If the access is being added, return the local data
    const accessAddInProgress = find(
      this.data.addAccessInProgress,
      (item) => item.ip === accessIp,
    );
    if (accessAddInProgress) {
      return accessAddInProgress;
    }

    // if not we get the details form the api
    return this.OvhApiDedicatedNasha.Partition()
      .Access()
      .v6()
      .get({
        serviceName: this.serviceName,
        partitionName: this.data.partition.partitionName,
        ip: accessIp,
      })
      .$promise.then((data) => data);
  }

  transformItem(access) {
    return this.getAccessForIp(access.ip);
  }

  launchPolling(taskId) {
    return this.Poller.poll(
      `/dedicated/nasha/${this.serviceName}/task/${taskId}`,
      null,
      {
        successRule(task) {
          return task.status === 'done';
        },
        errorRule(task) {
          return ['doing', 'todo', 'done'].indexOf(task.status) === -1;
        },
        namespace: 'nasha.access',
      },
    );
  }

  pollTasksForAccess(access, taskId) {
    this.launchPolling(taskId).finally(() => {
      // Remove from the polling list
      remove(this.data.taskForAccess, (item) => item.task === taskId);

      // If the partition was in creation, remove it from the creation list
      remove(this.data.addAccessInProgress, (item) => item.ip === access.ip);
      this.task = null;
      this.updateAccess(access);
    });
  }

  updateAccess() {
    this.load(true);
  }

  hasTaskInProgress(access) {
    return some(this.data.taskForAccess, { access });
  }
}
