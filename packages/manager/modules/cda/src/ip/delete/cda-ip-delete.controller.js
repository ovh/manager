export default class CdaIpDeleteCtrl {
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

    self.ip = {};

    self.saving = false;

    function init() {
      self.ip = $scope.$resolve.items.ip;
    }

    self.closeModal = function closeModal() {
      $uibModalInstance.dismiss();
    };

    self.deleteIp = function deleteIp() {
      self.saving = true;
      OvhApiDedicatedCeph.Acl()
        .v6()
        .delete({
          serviceName: $stateParams.serviceName,
          aclId: self.ip.id,
        })
        .$promise.then((result) => {
          $uibModalInstance.close({ taskId: result.data });
          CucCloudMessage.success($translate.instant('cda_ip_delete_success'));
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
