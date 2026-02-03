import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './service-renewal-badge.component';

const moduleName = 'ovhManagerServiceRenewalBadge';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerCore,
  ])
  .component('serviceRenewalBadge', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
