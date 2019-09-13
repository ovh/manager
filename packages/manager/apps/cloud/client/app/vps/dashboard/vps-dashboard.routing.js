import component from './vps-dashboard.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('iaas.vps.detail.dashboard', {
    url: '/dashboard',
    views: {
      'vpsContent@iaas.vps.detail': {
        component: component.name,
      },
    },
  });
};
