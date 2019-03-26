import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureVirtualMachineAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('iaas.pci-project.compute.infrastructure.vm-add', {
      url: '/vm/add',
      views: {
        cloudProjectComputeInfrastructure: {
          template,
          controller,
          controllerAs: '$ctrl',
        },
      },
    });
  })
  .service('CloudProjectVirtualMachineAddService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
