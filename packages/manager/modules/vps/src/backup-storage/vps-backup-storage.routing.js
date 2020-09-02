import component from './vps-backup-storage.component';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('vps.detail.backup-storage', {
    url: '/backup-storage',
    views: {
      'vpsContent@vps.detail': {
        component: component.name,
      },
    },
    resolve: {
      goToAddBackupStorage: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.backup-storage.add'),
      goToDeleteBackupStorage: /* @ngInject */ ($state) => (access) =>
        $state.go('vps.detail.backup-storage.delete', { access }),
      goToEditBackupStorage: /* @ngInject */ ($state) => (row) =>
        $state.go('vps.detail.backup-storage.edit', { row }),
      goToPassword: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.backup-storage.password'),
      goBack: /* @ngInject */ ($state) => () =>
        $state.go('vps.detail.backup-storage'),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('vps_backup_storage'),
    },
  });
};
