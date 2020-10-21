import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './history.component';

const moduleName = 'ovhManagerDedicatedBillingLegacyHistory';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate'])
  .component('billingLegacyHistory', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
