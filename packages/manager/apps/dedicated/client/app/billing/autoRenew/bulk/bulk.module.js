import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './bulk.component';

const moduleName = 'ovhManagerBillingAutorenewBulk';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('billingAutorenewBulk', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
