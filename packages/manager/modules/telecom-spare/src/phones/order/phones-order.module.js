import angular from 'angular';

import '@ovh-ux/manager-core';
import 'ovh-api-services';
import 'ovh-ui-angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ng-ovh-contact';

import component from './phones-order.component';
import routing from './phones-order.routing';

const moduleName = 'ovhManagerTelecomSpareOrderPhone';

angular
  .module(moduleName, [
    'ngOvhContact',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('phoneOrderComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
