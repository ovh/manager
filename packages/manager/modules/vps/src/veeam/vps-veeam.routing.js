import component from './vps-veeam.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.veeam', {
    url: '/veeam',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
  });
};
