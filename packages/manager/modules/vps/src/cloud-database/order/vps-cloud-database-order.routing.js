import component from './vps-cloud-database-order.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.cloud-database.order', {
    url: '/order',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
  });
};
