export default class IpLoadBalancerSslCertificatePreviewCtrl {
  /* @ngInject */
  constructor($uibModalInstance, ssl) {
    this.$uibModalInstance = $uibModalInstance;
    this.ssl = ssl;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }
}
