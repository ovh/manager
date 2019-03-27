import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import configure from './configure';

import controller from './controller';
import template from './template.html';
import service from './service';

const moduleName = 'ovhManagerPciProjectComputeLoadbalancer';

angular
  .module(moduleName, [
    configure,
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.legacy.compute.loadbalancer', {
        url: '/loadbalancer',
        sticky: true,
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: 'CloudProjectComputeLoadbalancerCtrl',
          },
        },
      });
  })
  .service('CloudProjectComputeLoadbalancerService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
