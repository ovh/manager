import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './terminate.component';

const moduleName = 'ovhManagerBillingAutorenewTerminate';

angular
  .module(moduleName, [
    ngAtInternet,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('billingAutorenewTerminate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
