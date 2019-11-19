import set from 'lodash/set';

export default class NashaPartitionAccessAddCtrl {
  /* @ngInject */
  constructor(
    $scope,
    $translate,
    $uibModalInstance,
    CucCloudMessage,
    OvhApiDedicatedNasha,
  ) {
    const self = this;

    self.loading = false;

    self.data = {
      serviceName: $scope.$resolve.items.serviceName,
      partition: $scope.$resolve.items.partition,
      accessAvailable: [],
      accessToAdd: null,
      type: 'readwrite', // readonly or readwrite
    };

    self.loadAccessList = function loadAccessList() {
      self.loading = true;
      OvhApiDedicatedNasha.Partition().Access().Aapi()
        .authorizableIps({
          serviceName: self.data.serviceName,
          partitionName: self.data.partition.partitionName,
        }).$promise.then((result) => {
          angular.forEach(result, (ip) => {
            if (!ip.description) {
              // ng-options groupby won't group items with undefined group.
              // We have to replace null with undefined.
              set(ip, 'description', undefined);
            }
          });
          self.data.accessAvailable = result;
        }).catch(() => {
          CucCloudMessage.success($translate.instant('nasha_partitions_access_loading_error'));
        }).finally(() => {
          self.loading = false;
        });
    };

    self.addAccess = function addAccess() {
      self.loading = true;
      OvhApiDedicatedNasha.Partition().Access().v6().add({
        serviceName: self.data.serviceName,
        partitionName: self.data.partition.partitionName,
      }, {
        ip: self.data.accessToAdd.ip,
        type: self.data.type,
      }).$promise.then((result) => {
        $uibModalInstance.close({
          access: {
            ip: self.data.accessToAdd.ip,
            type: self.data.type,
          },
          task: result.data.taskId,
          isNew: true,
        });
        CucCloudMessage.success($translate.instant('nasha_access_action_add_success', { accessIp: self.data.accessToAdd.ip }));
      }).catch(() => {
        $uibModalInstance.dismiss();
        CucCloudMessage.error($translate.instant('nasha_access_action_add_failure', { accessIp: self.data.accessToAdd.ip }));
      }).finally(() => {
        self.loading = false;
      });
    };

    self.dismiss = function dismiss() {
      $uibModalInstance.dismiss();
    };

    self.loadAccessList();
  }
}
