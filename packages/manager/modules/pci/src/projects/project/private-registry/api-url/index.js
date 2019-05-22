import angular from 'angular';
import '@uirouter/angularjs';
import apiUrlComponent from './api-url.component';

const moduleName = 'ovhManagerPciProjectPrivateRegistryApiUrl';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.private-registry.list.api-url', {
      url: '/api-url?registryId',
      params: {
        url: null,
      },
      layout: 'modal',
      component: 'apiUrlComponent',
      translations: {
        value: [
          './..',
          '.',
        ],
        format: 'json',
      },
      resolve: {
        breadcrumb: /* @ngInject */ $translate => $translate
          .refresh()
          .then(() => $translate.instant('private_registry_copy_api')),
      },
    });
  })
  .component('apiUrlComponent', apiUrlComponent);

export default moduleName;
