import IpLoadBalancerNatIpDetailTemplate from '../modal/nat-ip/iplb-nat-ip-detail.html';
import IpLoadBalancerFailoverIpDetailTemplate from '../modal/failover-ip/iplb-failover-ip-detail.html';
import IpLoadBalancerCercipherDetailTemplate from '../modal/cipher/iplb-cipher-change.html';
import IpLoadBalancerFrontensdDeleteTemplate from '../frontends/delete/iplb-frontends-delete.html';
import IpLoadBalancerServerFormDeleteTemplate from '../serverFarm/delete/iplb-server-farm-delete.html';
import IpLoadBalancerServerDeleteTemplate from '../server/delete/iplb-server-delete.html';
import IpLoadBalancerSslCertificateUpdateTemplate from '../sslCertificate/update/iplb-ssl-certificate-update.html';
import IpLoadBalancerSslCertificateDeleteTemplate from '../sslCertificate/delete/iplb-ssl-certificate-delete.html';

export default class IpLoadBalancerActionService {
  /* @ngInject */
  constructor(CucControllerHelper) {
    this.CucControllerHelper = CucControllerHelper;
  }

  showFailoverIpDetail(serviceName) {
    this.CucControllerHelper.modal.showModal({
      modalConfig: {
        template: IpLoadBalancerFailoverIpDetailTemplate,
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
        template: IpLoadBalancerNatIpDetailTemplate,
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
        template: IpLoadBalancerCercipherDetailTemplate,
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
        template: IpLoadBalancerFrontensdDeleteTemplate,
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
        template: IpLoadBalancerServerFormDeleteTemplate,
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
        template: IpLoadBalancerServerDeleteTemplate,
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
        template: IpLoadBalancerSslCertificateUpdateTemplate,
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
        template: IpLoadBalancerSslCertificateDeleteTemplate,
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
