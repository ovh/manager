import angular from 'angular';
import '@ovh-ux/ng-ovh-api-wrappers';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-swimming-poll';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

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
    'ngOvhCloudUniverseComponents',
    'ngOvhSwimmingPoll',
    'ngTranslateAsyncLoader',
    'ovh-api-services',
    'pascalprecht.translate',
  ])
  .factory('CloudProjectComputeInfrastructureFactory', factory)
  .filter('infrastructureFlavor', filter)
  .service('CloudProjectComputeInfrastructureOrchestrator', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
