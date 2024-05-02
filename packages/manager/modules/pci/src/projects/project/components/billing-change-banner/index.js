import angular from 'angular';
import '@ovh-ux/ng-at-internet';
import 'angular-translate';

import component from './billing-change-banner.component';

const moduleName = 'ovhManagerPciBillingChangeBanner';
angular
  .module(moduleName, ['ngAtInternet', 'pascalprecht.translate'])
  .component('pciBillingChangeBanner', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
