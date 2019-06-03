import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import activateMonthly from '../../instances/instance/active-monthly-billing/active-monthly-billing.module';
import instances from '../../instances/instances.module';
import routing from './monthly.routing';

const moduleName = 'ovhManagerPciProjectBillingMonthly';

angular
  .module(moduleName, [
    activateMonthly,
    instances,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
