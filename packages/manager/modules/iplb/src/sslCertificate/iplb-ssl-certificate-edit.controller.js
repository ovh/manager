export default class IpLoadBalancerSslCertificateEditCtrl {
  /* @ngInject */
  constructor(
    $q,
    $state,
    $stateParams,
    CucCloudMessage,
    IpLoadBalancerSslCertificateService,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.CucCloudMessage = CucCloudMessage;
    this.IpLoadBalancerSslCertificateService = IpLoadBalancerSslCertificateService;
  }

  create() {
    if (this.form.$invalid) {
      return this.$q.reject();
    }
    this.saving = true;
    this.CucCloudMessage.flushChildMessage();
    return this.IpLoadBalancerSslCertificateService.create(
      this.$stateParams.serviceName,
      this.ssl,
    )
      .then(() => {
        this.$state.go('iplb.detail.ssl-certificate');
      })
      .finally(() => {
        this.saving = false;
      });
  }
}
