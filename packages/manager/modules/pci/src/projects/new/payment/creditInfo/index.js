import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';

import component from './creditInfo.component';

const moduleName = 'ovhManagerPciProjectsNewPaymentCreditInfo';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectNewPaymentCreditInfo', component);

export default moduleName;
