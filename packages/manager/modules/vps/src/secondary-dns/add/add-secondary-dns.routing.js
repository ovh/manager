export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.secondary-dns.add', {
    url: '/add',
    views: {
      modal: {
        component: 'vpsSecondaryDnsAdd',
      },
    },
    layout: 'modal',
    resolve: {
      breadcrumb: () => null,
    },
  });
};
