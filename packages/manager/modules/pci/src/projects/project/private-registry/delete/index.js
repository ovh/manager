import angular from 'angular';
import '@uirouter/angularjs';
import deleteComponent from './delete.component';

const moduleName = 'ovhManagerPciProjectPrivateRegistryDelete';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.private-registry.list.delete', {
      url: '/delete?registryId',
      params: {
        registryName: null,
      },
      layout: 'modal',
      component: 'deleteComponent',
      translations: {
        value: [
          './..',
          '.',
        ],
        format: 'json',
      },
      resolve: {
        goBack: /* @ngInject */  goBackToState => goBackToState,
        breadcrumb: /* @ngInject */ $translate => $translate
          .refresh()
          .then(() => $translate.instant('private_registry_delete')),
      },
    });
  })
  .component('deleteComponent', deleteComponent);

export default moduleName;
