export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('network.iplb.detail.ssl-certificate.home.delete', {
    url: '/delete',
    params: {
      ssl: null,
    },
    views: {
      modal: {
        component: 'iplbSslCertificateDelete',
      },
    },
    layout: 'modal',
    resolve: {
      ssl: /* @ngInject */ ($transition$) => $transition$.params().ssl,
    },
  });
};
