import component from './vps-secondary-dns.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('iaas.vps.detail.secondary-dns', {
    url: '/secondary-dns',
    views: {
      'vpsContent@iaas.vps.detail': {
        component: component.name,
      },
    },
  });
};
