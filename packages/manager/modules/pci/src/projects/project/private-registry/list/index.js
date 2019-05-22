import angular from 'angular';
import '@uirouter/angularjs';
import listComponent from './list.component';

const moduleName = 'ovhManagerPciProjectPrivateRegistryList';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.private-registry.list', {
      url: '/list',
      component: 'listComponent',
      translations: {
        value: [
          './..',
          '.',
        ],
        format: 'json',
      },
      resolve: {
        breadcrumb: () => null, // Hide breadcrumb
      },
    })
      .state('pci.projects.project.private-registry.list.create', {
        url: '/create?fromState',
        views: {
          modal: {
            component: 'pciProjectPrivateRegistryCreateComponent',
          },
        },
        layout: 'modal',
        resolve: {
          goBack: /* @ngInject */  goBackToState => goBackToState,
        },
      })
      .state('pci.projects.project.private-registry.list.credentials', {
        url: '/credentials?registryId',
        component: 'credentialsComponent',
        layout: 'modal',
        params: {
          registryId: null,
          registryName: null,
          harborURL: null,
          fromState: null,
          confirmationRequired: null,
        },
        resolve: {
          goBack: /* @ngInject */  goBackToState => goBackToState,
          breadcrumb: /* @ngInject */ $translate => $translate
            .refresh()
            .then(() => $translate.instant('private_registry_generate_credentials')),
        },
      });
  })
  .component('listComponent', listComponent);

export default moduleName;
