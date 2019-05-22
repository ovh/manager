import angular from 'angular';
import '@uirouter/angularjs';
import updateComponent from './update.component';

const moduleName = 'ovhManagerPciProjectPrivateRegistryUpdate';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.private-registry.list.update', {
      url: '/update?registryId',
      params: {
        registryName: null,
      },
      component: 'updateComponent',
      layout: 'modal',
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
          .then(() => $translate.instant('private_registry_update_modal_title')),
      },
    });
  })
  .component('updateComponent', updateComponent);

export default moduleName;
