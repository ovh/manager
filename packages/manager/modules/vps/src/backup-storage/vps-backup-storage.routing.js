import component from './vps-backup-storage.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.backup-storage', {
    url: '/backup-storage',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
  });
};
