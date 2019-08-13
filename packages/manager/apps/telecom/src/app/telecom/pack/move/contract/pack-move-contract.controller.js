angular.module('managerApp').controller('PackMoveContractCtrl', function ($uibModalInstance, data) {
  const self = this;
  this.form = data.form;
  this.offer = data.offer;
  this.meeting = data.meeting;
  this.checkboxSelected = false;
  this.loading = false;

  this.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

  this.confirm = function () {
    self.loading = true;
    $uibModalInstance.close(true);
  };
});
