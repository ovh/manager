import component from './vps-cloud-database.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('iaas.vps.detail.cloud-database', {
      url: '/cloud-database',
      views: {
        'vpsContent@iaas.vps.detail': {
          component: component.name,
        },
      },
    });
};
