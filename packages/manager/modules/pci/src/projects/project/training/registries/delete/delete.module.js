import angular from 'angular';

import routing from './delete.routing';
import component from './delete.component';

const moduleName = 'ovhManagerPciProjectTrainingRegistriesDelete';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectTrainingRegistriesDelete', component);

export default moduleName;
