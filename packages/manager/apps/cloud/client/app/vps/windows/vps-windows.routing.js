import component from './vps-windows.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('iaas.vps.detail.windows', {
    url: '/windows',
    abstract: true,
    views: {
      'vpsContent@iaas.vps.detail': {
        component: component.name,
      },
    },
  });
};
