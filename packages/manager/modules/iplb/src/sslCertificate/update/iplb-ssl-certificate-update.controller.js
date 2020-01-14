export default class IpLoadBalancerSslCertificateUpdateCtrl {
  /* @ngInject */
  constructor(CucControllerHelper, IpLoadBalancerSslCertificateService) {
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerSslCertificateService = IpLoadBalancerSslCertificateService;
  }

  update() {
    this.updateSsl = this.CucControllerHelper.request.getHashLoader({
      loaderFunction: () =>
        this.IpLoadBalancerSslCertificateService.update(
          this.serviceName,
          this.ssl.id,
          { displayName: this.displayName },
        ).finally(() => this.goBack()),
    });
    return this.updateSsl.load();
  }
}
