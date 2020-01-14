export default class IpLoadBalancerSslCertificateCtrl {
  /* @ngInject */
  constructor(CucControllerHelper,
    IpLoadBalancerSslCertificateService) {
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerSslCertificateService = IpLoadBalancerSslCertificateService;
  }

  $onInit() {
    this.init();
  }

  init() {
    this.loading = true;
    this.IpLoadBalancerSslCertificateService.getCertificates(this.serviceName)
      .then((results) => {
        this.loading = false;
        this.certificates = results;
      });
  }
}
