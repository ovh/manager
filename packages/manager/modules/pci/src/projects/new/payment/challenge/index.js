import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-ovh-payment-method';
import 'angular-ui-validate';

import component from './challenge.component';

import './index.less';

const moduleName = 'ovhManagerPciProjectsNewPaymentChallenge';

angular
  .module(moduleName, [
    'oui',
    'ngOvhPaymentMethod',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.validate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('pciProjectNewPaymentChallenge', component);

export default moduleName;
