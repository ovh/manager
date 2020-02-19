export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.secondary-dns.delete', {
    url: '/delete',
    views: {
      modal: {
        component: 'vpsSecondaryDnsDelete',
      },
    },
    layout: 'modal',
  });
};
