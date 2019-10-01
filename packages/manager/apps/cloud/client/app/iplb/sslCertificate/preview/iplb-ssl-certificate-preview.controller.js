class IpLoadBalancerSslCertificatePreviewCtrl {
  constructor($uibModalInstance, ssl) {
    this.$uibModalInstance = $uibModalInstance;
    this.ssl = ssl;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}

angular.module('managerApp').controller('IpLoadBalancerSslCertificatePreviewCtrl', IpLoadBalancerSslCertificatePreviewCtrl);
