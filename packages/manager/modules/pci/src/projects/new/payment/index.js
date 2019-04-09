import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-ui-angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ng-ovh-payment-method';

import routing from './payment.routing';
import component from './payment.component';
import defaultComponent from './default/default.component';
import addComponent from './add/add.component';
import creditsComponent from './credits/credits.component';

const moduleName = 'ovhManagerPciProjectsNewPayment';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./add/translations */)
  .run(/* @ngTranslationsInject:json ./credits/translations */)
  .run(/* @ngTranslationsInject:json ./default/translations */)
  .component('pciProjectNewPayment', component)
  .component('pciProjectNewPaymentAdd', addComponent)
  .component('pciProjectNewPaymentCredits', creditsComponent)
  .component('pciProjectNewPaymentDefault', defaultComponent);

export default moduleName;
