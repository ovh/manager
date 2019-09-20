import angular from 'angular';

import '@ovh-ux/manager-core';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './modems.component';
import routing from './modems.routing';

const moduleName = 'ovhManagerTelecomSpareModems';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./modal/translations */)
  .component('modemsComponent', component);

export default moduleName;
