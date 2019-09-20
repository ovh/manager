(() => {
  const iplbHeader = {
    templateUrl: 'app/iplb/header/iplb-dashboard-header.html',
    controller: 'IpLoadBalancerDashboardHeaderCtrl',
    controllerAs: 'ctrl',
  };

  angular.module('managerApp').config(($stateProvider) => {
    $stateProvider
      .state('network.iplb.detail.ssl-certificate', {
        url: '/sslCertificate',
        redirectTo: 'network.iplb.detail.ssl-certificate.home',
        views: {
          iplbHeader,
          iplbContent: {
            template: '<div data-ui-view="iplbSslCertificate"><div>',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('network.iplb.detail.ssl-certificate.home', {
        url: '/',
        views: {
          iplbSslCertificate: {
            templateUrl: 'app/iplb/sslCertificate/iplb-ssl-certificate.html',
            controller: 'IpLoadBalancerSslCertificateCtrl',
            controllerAs: 'ctrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('network.iplb.detail.ssl-certificate.add', {
        url: '/sslCertificate/add',
        views: {
          iplbSslCertificate: {
            templateUrl: 'app/iplb/sslCertificate/iplb-ssl-certificate-edit.html',
            controller: 'IpLoadBalancerSslCertificateEditCtrl',
            controllerAs: 'ctrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      })
      .state('network.iplb.detail.ssl-certificate.order', {
        url: '/sslCertificate/order',
        views: {
          iplbSslCertificate: {
            templateUrl: 'app/iplb/sslCertificate/order/iplb-ssl-certificate-order.html',
            controller: 'IpLoadBalancerSslCertificateOrderCtrl',
            controllerAs: 'ctrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  });
})();
