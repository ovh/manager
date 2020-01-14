export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.ssl-certificate.add', {
    url: '/sslCertificate/add',
    views: {
      iplbSslCertificate: {
        component: 'iplbSslCertificateEdit',
      },
    },
  });
};
