import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';
import service from './service';

// TODO : import './index.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureVirtualMachineAdd';

angular
  .module(moduleName, [
    'ovh-api-services',
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
      translations: {
        value: ['.'],
        format: 'json',
      },
    });
  })
  .service('CloudProjectVirtualMachineAddService', service);

export default moduleName;
