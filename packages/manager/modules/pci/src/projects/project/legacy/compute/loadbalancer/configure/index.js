import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeLoadbalancerConfigure';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.legacy.compute.loadbalancerConfigure', {
        url: '/:loadbalancerId/configure?validate',
        views: {
          cloudProjectCompute: {
            template,
            controller,
            controllerAs: '$ctrl',
          },
        },
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
