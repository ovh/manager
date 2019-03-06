import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

import './index.less';

const moduleName = 'ovhManagerPciProjectComputeRegions';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.regions', {
        url: '/regions',
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: '$ctrl',
          },
        },
        translations: {
          value: ['.', './../infrastructure/virtualMachine/add'],
          format: 'json',
        },
      });
  });

export default moduleName;
