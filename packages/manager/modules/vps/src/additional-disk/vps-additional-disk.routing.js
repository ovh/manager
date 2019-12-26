import component from './vps-additional-disk.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.additional-disk', {
    url: '/additional-disk',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
  });
};
