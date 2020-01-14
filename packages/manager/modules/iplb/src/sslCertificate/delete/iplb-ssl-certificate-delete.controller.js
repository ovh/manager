export default class IpLoadBalancerSslCertificateDeleteCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, IpLoadBalancerSslCertificateService) {
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerSslCertificateService = IpLoadBalancerSslCertificateService;
  }

  $onInit() {
    this.name = this.ssl.displayName || this.ssl.frontendId;
    this.sslId = this.ssl.id;
  }

  confirm() {
    this.delete = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerSslCertificateService.delete(
          this.serviceName,
          this.sslId,
        ).finally(() => this.goBack()),
    });
    return this.delete.load();
  }
}
