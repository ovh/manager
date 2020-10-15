import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './service-status.component';

const moduleName = 'ovhManagerBillingServiceStatus';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerCore,
  ])
  .component('billingStatus', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
