import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import internet from './internet';
import vrack from './vrack';

import factory from './factory';
import filter from './filter';
import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectComputeInfrastructure';

angular
  .module(moduleName, [
    internet,
    vrack,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .factory('CloudProjectComputeInfrastructureFactory', factory)
  .filter('infrastructureFlavor', filter)
  .service('CloudProjectComputeInfrastructureOrchestrator', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
