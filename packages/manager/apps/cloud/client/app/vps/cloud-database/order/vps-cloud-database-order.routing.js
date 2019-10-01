import component from './vps-cloud-database-order.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('iaas.vps.detail.cloud-database.order', {
    url: '/order',
    views: {
      'vpsContent@iaas.vps.detail': {
        component: component.name,
      },
    },
  });
};
