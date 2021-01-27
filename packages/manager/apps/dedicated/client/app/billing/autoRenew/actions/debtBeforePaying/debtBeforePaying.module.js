import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './debtBeforePaying.component';
import routing from './debtBeforePaying.routing';

const moduleName = 'ovhManagerBillingAutorenewDebtBeforePaying';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewDebtBeforePaying', component);

export default moduleName;
