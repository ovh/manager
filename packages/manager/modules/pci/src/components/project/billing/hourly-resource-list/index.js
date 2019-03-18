import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './component';

const moduleName = 'ovhManagerPciComponentsProjectBillingHourlyResourceList';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('hourlyResourceList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
