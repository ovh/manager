export default class CdaPoolDeleteCtrl {
  /* @ngInject */
  constructor(
    $uibModalInstance,
    $translate,
    $stateParams,
    $scope,
    CucCloudMessage,
    OvhApiDedicatedCeph,
  ) {
    const self = this;

    self.pool = {};

    self.saving = false;

    function init() {
      self.pool = $scope.$resolve.items.pool;
    }

    self.closeModal = function closeModal() {
      $uibModalInstance.dismiss();
    };

    self.deletePool = function deletePool() {
      self.saving = true;
      OvhApiDedicatedCeph.Pool()
        .v6()
        .delete({
          serviceName: $stateParams.serviceName,
          poolName: self.pool.name,
        })
        .$promise.then((result) => {
          $uibModalInstance.close({ taskId: result.data });
          CucCloudMessage.success(
            $translate.instant('cda_pool_delete_success'),
          );
        })
        .catch((error) => {
          CucCloudMessage.error(
            [
              $translate.instant('ceph_common_error'),
              (error.data && error.data.message) || '',
            ].join(' '),
          );
        })
        .finally(() => {
          self.saving = false;
        });
    };

    init();
  }
}
