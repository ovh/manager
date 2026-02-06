import angular from 'angular';

import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ovhManagerCore from '@ovh-ux/manager-core';

import routing from './routing';
import component from './component';
import './index.scss';

const moduleName = 'ovhBillingPaymentMethodAdd';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    ngOvhPaymentMethod,
    ovhManagerCore,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
