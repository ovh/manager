class IpLoadBalancerSslCertificateCtrl {
  constructor($stateParams, CucControllerHelper, IpLoadBalancerActionService,
    IpLoadBalancerSslCertificateService) {
    this.$stateParams = $stateParams;
    this.CucControllerHelper = CucControllerHelper;
    this.IpLoadBalancerActionService = IpLoadBalancerActionService;
    this.IpLoadBalancerSslCertificateService = IpLoadBalancerSslCertificateService;
  }

  $onInit() {
    this.init();
  }

  init() {
    this.loading = true;
    this.IpLoadBalancerSslCertificateService.getCertificates(this.$stateParams.serviceName)
      .then((results) => {
        this.loading = false;
        this.certificates = results;
      });
  }

  update(ssl) {
    return this.IpLoadBalancerActionService.updateCertificate(this.$stateParams.serviceName, ssl)
      .then(() => {
        this.init();
      });
  }

  delete(ssl) {
    return this.IpLoadBalancerActionService.deleteCertificate(this.$stateParams.serviceName, ssl)
      .then(() => {
        this.init();
      });
  }

  preview(ssl) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/iplb/sslCertificate/preview/iplb-ssl-certificate-preview.html',
        controller: 'IpLoadBalancerSslCertificatePreviewCtrl',
        controllerAs: 'IpLoadBalancerSslCertificatePreviewCtrl',
        resolve: {
          ssl: () => ssl,
        },
      },
    });
  }
}

angular.module('managerApp').controller('IpLoadBalancerSslCertificateCtrl', IpLoadBalancerSslCertificateCtrl);
