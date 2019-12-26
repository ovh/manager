import component from './vps-secondary-dns.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.secondary-dns', {
    url: '/secondary-dns',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
  });
};
