class IpLoadBalancerActionService {
  constructor(CucControllerHelper) {
    this.CucControllerHelper = CucControllerHelper;
  }

  showFailoverIpDetail(serviceName) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/iplb/modal/failover-ip/iplb-failover-ip-detail.html',
        controller: 'IpLoadBalancerFailoverIpDetailCtrl',
        controllerAs: 'IpLoadBalancerFailoverIpDetailCtrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  showNatIpDetail(serviceName) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/iplb/modal/nat-ip/iplb-nat-ip-detail.html',
        controller: 'IpLoadBalancerNatIpDetailCtrl',
        controllerAs: 'IpLoadBalancerNatIpDetailCtrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
    });
  }

  cipherChange(serviceName, successHandler) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/iplb/modal/cipher/iplb-cipher-change.html',
        controller: 'IpLoadBalancerCipherChangeCtrl',
        controllerAs: 'IpLoadBalancerCipherChangeCtrl',
        resolve: {
          serviceName: () => serviceName,
        },
      },
      successHandler,
    });
  }

  deleteFrontend(serviceName, frontend) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/iplb/frontends/delete/iplb-frontends-delete.html',
        controller: 'IpLoadBalancerFrontendDeleteCtrl',
        controllerAs: 'IpLoadBalancerFrontendDeleteCtrl',
        backdrop: 'static',
        resolve: {
          serviceName: () => serviceName,
          frontend: () => frontend,
        },
      },
    });
  }

  deleteFarm(serviceName, farm) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/iplb/serverFarm/delete/iplb-server-farm-delete.html',
        controller: 'IpLoadBalancerServerFarmDeleteCtrl',
        controllerAs: 'IpLoadBalancerServerFarmDeleteCtrl',
        backdrop: 'static',
        resolve: {
          serviceName: () => serviceName,
          farm: () => farm,
        },
      },
    });
  }

  deleteServer(serviceName, farm, server) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/iplb/server/delete/iplb-server-delete.html',
        controller: 'IpLoadBalancerServerDeleteCtrl',
        controllerAs: 'IpLoadBalancerServerDeleteCtrl',
        backdrop: 'static',
        resolve: {
          serviceName: () => serviceName,
          farm: () => farm,
          server: () => server,
        },
      },
    });
  }

  updateCertificate(serviceName, ssl) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/iplb/sslCertificate/update/iplb-ssl-certificate-update.html',
        controller: 'IpLoadBalancerSslCertificateUpdateCtrl',
        controllerAs: 'IpLoadBalancerSslCertificateUpdateCtrl',
        resolve: {
          serviceName: () => serviceName,
          ssl: () => ssl,
        },
      },
    });
  }

  deleteCertificate(serviceName, ssl) {
    return this.CucControllerHelper.modal.showModal({
      modalConfig: {
        templateUrl: 'app/iplb/sslCertificate/delete/iplb-ssl-certificate-delete.html',
        controller: 'IpLoadBalancerSslCertificateDeleteCtrl',
        controllerAs: 'IpLoadBalancerSslCertificateDeleteCtrl',
        backdrop: 'static',
        resolve: {
          serviceName: () => serviceName,
          ssl: () => ssl,
        },
      },
    });
  }
}

angular.module('managerApp').service('IpLoadBalancerActionService', IpLoadBalancerActionService);
