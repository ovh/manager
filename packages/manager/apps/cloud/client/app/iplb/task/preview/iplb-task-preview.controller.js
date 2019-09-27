class IpLoadBalancerTaskPreviewCtrl {
  constructor($uibModalInstance, task) {
    this.$uibModalInstance = $uibModalInstance;
    this.task = task;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module('managerApp').controller('IpLoadBalancerTaskPreviewCtrl', IpLoadBalancerTaskPreviewCtrl);
