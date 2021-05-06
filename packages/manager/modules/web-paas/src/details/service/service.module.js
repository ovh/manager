import angular from 'angular';
import 'angular-translate';

import component from './service.component';
import routing from './service.routing';
import terminate from './terminate';
import addAddon from './add-addon';
import editRange from './edit-range';

const moduleName = 'ovhManagerWebPaasDetailsService';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    addAddon,
    editRange,
    terminate,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('webPaasDetailsService', component);

export default moduleName;
