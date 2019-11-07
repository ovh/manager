export default class IpLoadBalancerSslCertificateDeleteCtrl {
  /* @ngInject */
  constructor($stateParams, $uibModalInstance, CucControllerHelper,
    IpLoadBalancerSslCertificateService, ssl) {
    this.$stateParams = $stateParams;
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerSslCertificateService = IpLoadBalancerSslCertificateService;

    this.ssl = ssl;
    this.name = ssl.displayName || ssl.frontendId;
    this.sslId = ssl.id;
  }

  confirm() {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerSslCertificateService
        .delete(this.$stateParams.serviceName, this.sslId)
        .then(response => this.$uibModalInstance.close(response))
        .catch(error => this.$uibModalInstance.dismiss(error)),
    });
    return this.delete.load();
  }

  cancel() {
    this.$uibModalInstance.dismiss();
  }
}
