import component from './vps-backup-storage.component';

export default /* @ngInject */($stateProvider) => {
  $stateProvider.state('iaas.vps.detail.backup-storage', {
    url: '/backup-storage',
    views: {
      'vpsContent@iaas.vps.detail': {
        component: component.name,
      },
    },
  });
};
