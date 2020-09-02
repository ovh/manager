export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.secondary-dns.delete', {
    url: '/delete',
    params: {
      domain: null,
    },
    views: {
      modal: {
        component: 'vpsSecondaryDnsDelete',
      },
    },
    layout: 'modal',
    resolve: {
      domain: /* @ngInject */ ($transition$) => $transition$.params().domain,
      breadcrumb: () => null,
    },
  });
};
