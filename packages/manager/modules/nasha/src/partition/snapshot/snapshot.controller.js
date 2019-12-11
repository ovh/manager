import difference from 'lodash/difference';
import forEach from 'lodash/forEach';
import indexOf from 'lodash/indexOf';
import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';
import get from 'lodash/get';

export default class NashaPartitionSnapshotCtrl {
  /* @ngInject */
  constructor(
    $q,
    $scope,
    $stateParams,
    $translate,
    CucCloudMessage,
    OvhApiDedicatedNasha,
  ) {
    this.$q = $q;
    this.$scope = $scope;
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.CucCloudMessage = CucCloudMessage;
    this.OvhApiDedicatedNasha = OvhApiDedicatedNasha;
    this.loading = false;
  }

  $onInit() {
    this.snapshotEnum = null;
    this.data = {
      nashaId: this.serviceName,
      partition: this.partition,
    };

    this.snapshots = {
      before: [],
      after: [],
    };

    this.loading = true;
    this.schedule = {};

    this.OvhApiDedicatedNasha.v6().schema()
      .$promise.then((data) => {
        this.snapshotEnum = data.models['dedicated.storage.SnapshotEnum'].enum;
      });

    this.OvhApiDedicatedNasha.Partition().Snapshot().v6().query({
      serviceName: this.data.nashaId,
      partitionName: this.data.partition.partitionName,
    }).$promise.then((data) => {
      angular.copy(data, this.snapshots.before);
      angular.copy(data, this.snapshots.after);
    }).catch(() => {
      this.CucCloudMessage.error(this.$translate.instant('nasha_snapshot_loading_error'));
    }).finally(() => {
      this.loading = false;
    });
  }

  isSelectionChanged() {
    return !isEqual(this.snapshots.before, this.snapshots.after);
  }

  isScheduled(snapshot) {
    return indexOf(this.snapshots.after, snapshot) > -1;
  }

  changeSchedule(snapshot, checked) {
    if (checked) {
      this.snapshots.after.push(snapshot);
    } else {
      remove(this.snapshots.after, item => item === snapshot);
    }
  }

  applyScheduleChanges() {
    this.loading = true;
    const promises = [];
    this.getAddSchedulesPromises(promises);
    this.getDeleteSchedulesPromises(promises);
    this.$q.all(promises)
      .then((tasks) => {
        this.goToPartitionPage(
          this.$translate.instant('nasha_snapshot_set_success', {
            partition: this.data.partition,
          }),
          'success',
          {
            tasks,
          },
        );
      })
      .catch(error => this.goToPartitionPage(
        this.$translate.instant('nasha_snapshot_set_success_fail', {
          partitionName: this.data.partition.partitionName,
          message: get(error, 'data.message'),
        }),
        'error',
      )).finally(() => {
        this.loading = false;
      });
  }

  getAddSchedulesPromises(promises) {
    const addToSchedule = difference(this.snapshots.after, this.snapshots.before);
    forEach(addToSchedule, (schedule) => {
      promises.push(this.OvhApiDedicatedNasha.Partition().Snapshot().v6().add({
        serviceName: this.data.nashaId,
        partitionName: this.data.partition.partitionName,
      }, {
        snapshotType: schedule,
      }).$promise.then(result => result.data.taskId));
    });
  }

  getDeleteSchedulesPromises(promises) {
    const deleteFromSchedule = difference(this.snapshots.before, this.snapshots.after);
    forEach(deleteFromSchedule, (schedule) => {
      promises.push(this.OvhApiDedicatedNasha.Partition().Snapshot().v6().remove({
        serviceName: this.data.nashaId,
        partitionName: this.data.partition.partitionName,
        snapshotType: schedule,
      }).$promise.then(result => result.data.taskId));
    });
  }

  dismiss() {
    this.goToPartitionPage();
  }
}
