export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.ssl-certificate.update', {
    url: '/sslCertificate/update',
    params: {
      ssl: null,
    },
    views: {
      iplbSslCertificate: {
        component: 'iplbSslCertificateUpdate',
      },
    },
    resolve: {
      ssl: /* @ngInject */ ($transition$) => $transition$.params().ssl,
    },
    layout: 'modal',
  });
};
