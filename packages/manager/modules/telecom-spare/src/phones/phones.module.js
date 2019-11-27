import angular from 'angular';

import '@ovh-ux/manager-core';
import 'ovh-api-services';
import 'ovh-ui-angular';

import deletePhones from './delete/phones-delete.module';
import replacePhones from './replace/phones-replace.module';
import orderPhone from './order/phones-order.module';

import component from './phones.component';
import routing from './phones.routing';

const moduleName = 'ovhManagerTelecomSparePhones';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    deletePhones,
    replacePhones,
    orderPhone,
  ])
  .component('phonesComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
