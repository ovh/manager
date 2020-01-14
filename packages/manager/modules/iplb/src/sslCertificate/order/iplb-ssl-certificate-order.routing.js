export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.ssl-certificate.order', {
    url: '/sslCertificate/order',
    views: {
      iplbSslCertificate: {
        component: 'iplbSslCertificateOrder',
      },
    },
  });
};
