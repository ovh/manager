import angular from 'angular';

import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';

import routing from './routing';
import component from './component';

const moduleName = 'ovhBillingPaymentMethodEdit';

angular
  .module(moduleName, [
    angularTranslate,
    'oui',
    ngTranslateAsyncLoader,
    ngOvhPaymentMethod,
    ngUiRouterLayout,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
