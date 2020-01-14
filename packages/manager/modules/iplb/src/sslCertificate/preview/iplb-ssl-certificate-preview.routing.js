export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.ssl-certificate.preview', {
    url: '/sslCertificate/preview',
    params: {
      ssl: null,
    },
    views: {
      iplbSslCertificate: {
        component: 'iplbSslCertificatepreview',
      },
    },
    resolve: {
      ssl: /* @ngInject */ ($transition$) => $transition$.params().ssl,
    },
  });
};
