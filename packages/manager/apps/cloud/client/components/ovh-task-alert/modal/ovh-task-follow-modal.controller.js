class ovhTaskFollowModalCtrl {
  constructor($uibModalInstance, tasks) {
    this.$uibModalInstance = $uibModalInstance;
    this.tasks = tasks;
    this.isOpenState = {};
    this.isOpenState[tasks[0].task_id] = true;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}

angular
  .module('managerApp')
  .controller('ovhTaskFollowModalCtrl', ovhTaskFollowModalCtrl);
