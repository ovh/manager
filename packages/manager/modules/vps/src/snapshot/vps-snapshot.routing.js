import component from './vps-snapshot.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.snapshot', {
    url: '/snapshot',
    abstract: true,
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
  });
};
