angular
  .module('managerApp')
  .controller('PackMoveContractCtrl', function PackMoveContractCtrl(
    $uibModalInstance,
    data,
  ) {
    const self = this;
    this.form = data.form;
    this.offer = data.offer;
    this.meeting = data.meeting;
    this.checkboxSelected = false;
    this.loading = false;

    this.cancel = function cancel() {
      $uibModalInstance.dismiss('cancel');
    };

    this.confirm = function confirm() {
      self.loading = true;
      $uibModalInstance.close(true);
    };
  });
