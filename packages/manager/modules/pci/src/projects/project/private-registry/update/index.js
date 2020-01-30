import angular from 'angular';
import '@uirouter/angularjs';
import pciPrivateRegistryUpdate from './update.component';

const moduleName = 'ovhManagerPciProjectPrivateRegistryUpdate';

angular
  .module(moduleName, ['ui.router'])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('pci.projects.project.private-registry.update', {
        url: '/update?registryId',
        params: {
          registryName: null,
        },
        views: {
          modal: {
            component: 'pciPrivateRegistryUpdate',
          },
        },
        layout: 'modal',
        resolve: {
          goBack: /* @ngInject */ (goBackToList) => goBackToList,
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('private_registry_update_modal_title'),
        },
      });
    },
  )
  .component('pciPrivateRegistryUpdate', pciPrivateRegistryUpdate);

export default moduleName;
