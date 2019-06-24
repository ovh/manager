import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';
import '@ovh-ux/ng-ovh-payment-method';
import 'angular-ui-validate';

import component from './challenge.component';
import routing from './challenge.routing';
import paypal from './paypal';

import './index.less';

const moduleName = 'ovhManagerPciProjectsNewPaymentChallenge';

angular
  .module(moduleName, [
    'oui',
    'ngOvhPaymentMethod',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.validate',
    paypal,
  ])
  .config(routing)
  .component('pciProjectNewPaymentChallenge', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
