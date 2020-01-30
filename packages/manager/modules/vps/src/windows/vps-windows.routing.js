import component from './vps-windows.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.windows', {
    url: '/windows',
    abstract: true,
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
  });
};
