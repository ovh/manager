import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './disable-domains-bulk.component';
import routing from './disable-domains-bulk.routing';

const moduleName = 'ovhManagerBillingAutorenewDisableDomainsBulk';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('billingAutorenewDisableDomainsBulk', component);

export default moduleName;
