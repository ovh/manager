export default class IpLoadBalancerSslCertificateUpdateCtrl {
  /* @ngInject */
  constructor($uibModalInstance, CucControllerHelper, IpLoadBalancerSslCertificateService,
    serviceName, ssl) {
    this.$uibModalInstance = $uibModalInstance;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerSslCertificateService = IpLoadBalancerSslCertificateService;
    this.serviceName = serviceName;
    this.ssl = ssl;
  }

  dismiss() {
    this.$uibModalInstance.dismiss();
  }

  update() {
    this.updateSsl = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () => this.IpLoadBalancerSslCertificateService
        .update(this.serviceName, this.ssl.id, { displayName: this.displayName })
        .then(response => this.$uibModalInstance.close(response))
        .catch(error => this.$uibModalInstance.dismiss(error)),
    });
    return this.updateSsl.load();
  }
}
