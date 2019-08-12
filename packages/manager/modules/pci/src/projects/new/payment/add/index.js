import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ng-ovh-payment-method';

import component from './add.component';

const moduleName = 'ovhManagerPciProjectsNewPaymentAdd';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectNewPaymentAdd', component);

export default moduleName;
