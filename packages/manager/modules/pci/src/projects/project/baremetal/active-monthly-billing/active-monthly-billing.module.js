import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';

import activeBilling from '../instance/active-monthly-billing/active-monthly-billing.module';
import routing from './active-monthly-billing.routing';

const moduleName = 'ovhManagerPciBaremetalActiveMonthlyBilling';

angular
  .module(moduleName, [
    activeBilling,
    'ui.router',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing);

export default moduleName;
