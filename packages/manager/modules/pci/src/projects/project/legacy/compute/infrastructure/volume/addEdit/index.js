import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import controller from './controller';
import template from './template.html';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureVolumeAddEdit';

angular
  .module(moduleName, [
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider) => {
    $stateProvider
      .state('pci.projects.project.legacy.compute.infrastructure.volume-add-edit', {
        url: '/volume/addEdit',
        template,
        controller,
        controllerAs: 'CloudProjectComputeInfrastructureVolumeAddEditCtrl',
      });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
