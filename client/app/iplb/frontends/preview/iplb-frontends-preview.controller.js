class IpLoadBalancerFrontendPreviewCtrl {
  constructor($uibModalInstance, frontend) {
    this.$uibModalInstance = $uibModalInstance;
    this.frontend = frontend;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module('managerApp').controller('IpLoadBalancerFrontendPreviewCtrl', IpLoadBalancerFrontendPreviewCtrl);
