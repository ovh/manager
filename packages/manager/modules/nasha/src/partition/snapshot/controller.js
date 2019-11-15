import difference from 'lodash/difference';
import forEach from 'lodash/forEach';
import indexOf from 'lodash/indexOf';
import isEqual from 'lodash/isEqual';
import remove from 'lodash/remove';

export default class NashaPartitionSnapshotCtrl {
  /* @ngInject */ /* eslint-disable max-len */
  constructor($stateParams, $scope, $uibModalInstance, $q, $translate, OvhApiDedicatedNasha, CucCloudMessage) {
    const self = this;

    self.snapshotEnum = null;
    self.loading = false;
    self.data = {
      nashaId: $stateParams.nashaId,
      partition: $scope.$resolve.items,
    };

    self.snapshots = {
      before: [],
      after: [],
    };

    self.isSelectionChanged = function isSelectionChanged() {
      return !isEqual(self.snapshots.before, self.snapshots.after);
    };

    self.isScheduled = function isScheduled(snapshot) {
      return indexOf(self.snapshots.after, snapshot) > -1;
    };

    self.changeSchedule = function changeSchedule(snapshot, checked) {
      if (checked) {
        self.snapshots.after.push(snapshot);
      } else {
        remove(self.snapshots.after, item => item === snapshot);
      }
    };

    self.applyScheduleChanges = function applyScheduleChanges() {
      self.loading = true;
      const promises = [];
      self.getAddSchedulesPromises(promises);
      self.getDeleteSchedulesPromises(promises);
      $q.all(promises)
        .then((tasks) => {
          CucCloudMessage.success($translate.instant('nasha_snapshot_set_success'));
          $uibModalInstance.close({ partition: self.data.partition, tasks });
        }).catch(() => {
          CucCloudMessage.error($translate.instant('nasha_snapshot_set_success_fail'));
          $uibModalInstance.dismiss();
        }).finally(() => {
          self.loading = false;
        });
    };

    self.getAddSchedulesPromises = function getAddSchedulesPromises(promises) {
      const addToSchedule = difference(self.snapshots.after, self.snapshots.before);
      forEach(addToSchedule, (schedule) => {
        promises.push(OvhApiDedicatedNasha.Partition().Snapshot().v6().add({
          serviceName: self.data.nashaId,
          partitionName: self.data.partition.partitionName,
        }, {
          snapshotType: schedule,
        }).$promise.then(result => result.data.taskId));
      });
    };

    self.getDeleteSchedulesPromises = function getDeleteSchedulesPromises(promises) {
      const deleteFromSchedule = difference(self.snapshots.before, self.snapshots.after);
      forEach(deleteFromSchedule, (schedule) => {
        promises.push(OvhApiDedicatedNasha.Partition().Snapshot().v6().remove({
          serviceName: self.data.nashaId,
          partitionName: self.data.partition.partitionName,
          snapshotType: schedule,
        }).$promise.then(result => result.data.taskId));
      });
    };

    self.dismiss = function dismiss() {
      $uibModalInstance.dismiss();
    };

    function init() {
      self.loading = true;
      self.schedule = {};

      OvhApiDedicatedNasha.v6().schema()
        .$promise.then((data) => {
          self.snapshotEnum = data.models['dedicated.storage.SnapshotEnum'].enum;
        });

      OvhApiDedicatedNasha.Partition().Snapshot().v6().query({
        serviceName: self.data.nashaId,
        partitionName: self.data.partition.partitionName,
      }).$promise.then((data) => {
        angular.copy(data, self.snapshots.before);
        angular.copy(data, self.snapshots.after);
      }).catch(() => {
        CucCloudMessage.error($translate.instant('nasha_snapshot_loading_error'));
      }).finally(() => {
        self.loading = false;
      });
    }

    init();
  }
}
