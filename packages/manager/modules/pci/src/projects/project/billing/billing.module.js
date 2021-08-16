import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import history from './history';
import activateMonthly from './monthly';
import legacy from './legacy/billing-legacy.module';
import component from './billing.component';
import routing from './billing.routing';

const moduleName = 'ovhManagerPciProjectBilling';

angular
  .module(moduleName, [
    activateMonthly,
    legacy,
    history,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectBilling', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
