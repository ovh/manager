import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingMonthlyResourceList';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('monthlyResourceList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
