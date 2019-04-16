export default /* @ngInject */($stateProvider) => {
  $stateProvider
    .state('pci.projects.project.storages.instance-backups.delete', {
      url: '/delete?instanceBackupId',
      views: {
        modal: {
          component: 'pciProjectStorageInstanceBackupsDelete',
        },
      },
      layout: 'modal',
      resolve: {
        instanceBackupId: /* @ngInject */$transition$ => $transition$.params().instanceBackupId,
        goBack: /* @ngInject */ ($rootScope, $state, projectId) => (reload = false) => {
          if (reload) {
            $rootScope.$emit('pci_storages_instance-backups_refresh');
          }
          return $state.go('pci.projects.project.storages.instance-backups', {
            projectId,
          });
        },
      },
    });
};
