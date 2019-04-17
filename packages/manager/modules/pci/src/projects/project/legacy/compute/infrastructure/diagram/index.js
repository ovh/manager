import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureDiagram';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider.state('pci.projects.project.legacy.compute.infrastructure.diagram', {
      url: '/diagram',
      views: {
        cloudProjectComputeInfrastructure: {
          template,
          controller,
          controllerAs: 'ComputeInfrastructureDiagramCtrl',
          noTranslations: true,
        },
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
