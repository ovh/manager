import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './active-monthly-billing.component';
import routing from './active-monthly-billing.routing';

const moduleName = 'ovhManagerPciInstancesInstanceActiveMonthlyBilling';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciInstancesInstanceActiveMonthlyBilling', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
