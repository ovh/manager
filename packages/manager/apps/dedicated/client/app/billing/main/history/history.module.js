import angular from 'angular';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './history.component';
import routing from './billing-main-history.routes';

const moduleName = 'ovhManagerDedicatedBillingHistory';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .config(routing)
  .component('billingHistory', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
