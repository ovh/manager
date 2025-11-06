import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './renew-status.component';

const moduleName = 'ovhManagerBillingRenewStatus';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerCore,
  ])
  .component('renewStatus', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
