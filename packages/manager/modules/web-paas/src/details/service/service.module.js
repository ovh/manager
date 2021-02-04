import angular from 'angular';
import 'angular-translate';

import component from './service.component';
import routing from './service.routing';
import name from './edit-name';
import terminate from './terminate';

const moduleName = 'ovhManagerWebPaasDetailsService';

angular
  .module(moduleName, ['pascalprecht.translate', name, terminate])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('webPaasDetailsService', component);

export default moduleName;
