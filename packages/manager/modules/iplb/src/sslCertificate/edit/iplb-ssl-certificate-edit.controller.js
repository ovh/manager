export default class IpLoadBalancerSslCertificateEditCtrl {
  /* @ngInject */
  constructor($q, CucCloudMessage, IpLoadBalancerSslCertificateService) {
    this.$q = $q;
    this.CucCloudMessage = CucCloudMessage;
    this.IpLoadBalancerSslCertificateService = IpLoadBalancerSslCertificateService;
  }

  create() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerSslCertificateService.create(this.serviceName, this.ssl)
      .then(() => {
        this.goBack();
      })
      .finally(() => {
        this.saving = false;
      });
  }
}
