import angular from 'angular';

import '@ovh-ux/manager-core';
import 'ovh-api-services';
import 'ovh-ui-angular';

import component from './phones.component';
import routing from './phones.routing';

const moduleName = 'ovhManagerTelecomSparePhones';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
  ])
  .component('phonesComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./modal/translations */);

export default moduleName;
