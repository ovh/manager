import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import configure from './configure';

import controller from './controller';
import template from './template.html';
import service from './service';

import './index.less';

const moduleName = 'ovhManagerPciProjectComputeLoadbalancer';

angular
  .module(moduleName, [
    configure,
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('iaas.pci-project.compute.loadbalancer', {
        url: '/loadbalancer',
        sticky: true,
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: 'CloudProjectComputeLoadbalancerCtrl',
          },
        },
        translations: {
          value: ['.'],
          format: 'json',
        },
      });
  })
  .service('CloudProjectComputeLoadbalancerService', service);
