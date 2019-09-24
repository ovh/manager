import angular from 'angular';

import '@ovh-ux/manager-core';
import 'ovh-api-services';
import 'ovh-ui-angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import ngOvhContact from '@ovh-ux/ng-ovh-contact';

import component from './modems-order.component';
import routing from './modems-order.routing';

const moduleName = 'ovhManagerTelecomSpareOrderModem';

angular
  .module(moduleName, [
    ngOvhContact,
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('modemOrderComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
