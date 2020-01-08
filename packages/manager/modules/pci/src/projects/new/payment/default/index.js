import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './default.component';

const moduleName = 'ovhManagerPciProjectsNewPaymentDefault';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectNewPaymentDefault', component);

export default moduleName;
