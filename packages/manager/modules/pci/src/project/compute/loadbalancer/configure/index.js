import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeLoadbalancerConfigure';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.loadbalancerConfigure', {
        url: '/:loadbalancerId/configure?validate',
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: '$ctrl',
          },
        },
      });
  });

export default moduleName;
