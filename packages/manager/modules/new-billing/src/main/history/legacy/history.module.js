import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './history.component';

const moduleName = 'ovhManagerDedicatedBillingLegacyHistory';

angular
  .module(moduleName, [angularTranslate, 'oui'])
  .component('billingLegacyHistory', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
