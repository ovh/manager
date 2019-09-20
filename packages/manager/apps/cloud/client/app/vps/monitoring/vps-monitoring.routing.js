import component from './vps-monitoring.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('iaas.vps.detail.monitoring', {
    url: '/monitoring',
    views: {
      'vpsContent@iaas.vps.detail': {
        component: component.name,
      },
    },
  });
};
