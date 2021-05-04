import angular from 'angular';
import 'angular-translate';

import component from './service.component';
import routing from './service.routing';
import terminate from './terminate';
import addAddon from './add-addon';

const moduleName = 'ovhManagerWebPaasDetailsService';

angular
  .module(moduleName, ['pascalprecht.translate', addAddon, terminate])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('webPaasDetailsService', component);

export default moduleName;
