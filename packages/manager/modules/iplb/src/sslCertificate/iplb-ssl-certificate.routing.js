import IplbHeaderTemplate from '../header/iplb-dashboard-header.html';

export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('network.iplb.detail.ssl-certificate', {
      url: '/sslCertificate',
      redirectTo: 'network.iplb.detail.ssl-certificate.home',
      views: {
        iplbHeader: {
          template: IplbHeaderTemplate,
          controller: 'IpLoadBalancerDashboardHeaderCtrl',
          controllerAs: 'ctrl',
        },
        iplbContent: {
          template: '<div data-ui-view="iplbSslCertificate"><div>',
        },
      },
      resolve: {
        goBack: /* @ngInject */ ($state) => () => $state.go('network.iplb.detail.ssl-certificate.home'),
        serviceName: /* @ngInject */ ($transition$) => $transition$.params().serviceName,
      },
    })
    .state('network.iplb.detail.ssl-certificate.home', {
      url: '',
      views: {
        iplbSslCertificate: {
          component: 'iplbSSLcertificatesComponent',
        },
      },
      resolve: {
        goToPreview: /* @ngInject */ ($state, serviceName) => (ssl) => $state.go('network.iplb.detail.ssl-certificate.preview', { serviceName, ssl }),
        goToDelete: /* @ngInject */ ($state, serviceName) => (ssl) => $state.go('network.iplb.detail.ssl-certificate.delete', { serviceName, ssl }),
        goToUpdate: /* @ngInject */ ($state, serviceName) => (ssl) => $state.go('network.iplb.detail.ssl-certificate.update', { serviceName, ssl }),
      },
    });
};
