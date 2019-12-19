import angular from 'angular';
import '@uirouter/angularjs';
import deleteComponent from './delete.component';

const moduleName = 'ovhManagerPciProjectPrivateRegistryDelete';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.private-registry.delete', {
      url: '/delete?registryId',
      params: {
        registryName: null,
      },
      views: {
        modal: {
          component: 'deleteComponent',
        },
      },
      layout: 'modal',
      resolve: {
        goBack: /* @ngInject */  (goBackToList) => goBackToList,
        breadcrumb: /* @ngInject */ ($translate) => $translate.instant('private_registry_delete'),
      },
    });
  })
  .component('deleteComponent', deleteComponent);

export default moduleName;
