import angular from 'angular';
import 'angular-translate';

import component from './service.component';
import routing from './service.routing';
import terminate from './terminate';
import addStorage from './add-storage';

const moduleName = 'ovhManagerWebPaasDetailsService';

angular
  .module(moduleName, ['pascalprecht.translate', addStorage, terminate])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('webPaasDetailsService', component);

export default moduleName;
