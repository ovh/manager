import component from './vps-snapshot.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('iaas.vps.detail.snapshot', {
    url: '/snapshot',
    abstract: true,
    views: {
      'vpsContent@iaas.vps.detail': {
        component: component.name,
      },
    },
  });
};
