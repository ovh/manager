import angular from 'angular';

import routing from './add.routing';
import component from './add.component';

const moduleName = 'ovhManagerPciProjectTrainingRegistriesAddRegistry';

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
  .component(
    'ovhManagerPciProjectTrainingRegistriesAddRegistryComponent',
    component,
  );

export default moduleName;
