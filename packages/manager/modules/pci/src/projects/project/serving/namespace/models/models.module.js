import angular from 'angular';

import component from './models.component';
import routing from './models.routing';

import service from './service/models.module';
import add from './add';
import deleteModule from './delete';
import update from './update';
import details from './details';

const moduleName = 'ovhManagerPciProjectServingNamespaceModels';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    service,
    add,
    deleteModule,
    update,
    details,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceModelsComponent', component);

export default moduleName;
