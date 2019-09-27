import component from './vps-veeam.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('iaas.vps.detail.veeam', {
    url: '/veeam',
    views: {
      'vpsContent@iaas.vps.detail': {
        component: component.name,
      },
    },
  });
};
