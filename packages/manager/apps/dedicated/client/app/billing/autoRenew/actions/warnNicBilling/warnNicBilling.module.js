import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './warnNicBilling.component';
import routing from './warnNicBilling.routing';

const moduleName = 'ovhManagerBillingAutorenewWarnNicBilling';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewWarnNicBilling', component);

export default moduleName;
