import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ng-ui-router-layout';

import routing from './routing';
import component from './component';

const moduleName = 'ovhBillingPaymentMethodEdit';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
    'ngUiRouterLayout',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
