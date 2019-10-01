import component from './vps-additional-disk.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('iaas.vps.detail.additional-disk', {
    url: '/additional-disk',
    views: {
      'vpsContent@iaas.vps.detail': {
        component: component.name,
      },
    },
  });
};
