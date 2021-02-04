import angular from 'angular';

import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';

import component from './component';

const moduleName = 'ovhBillingPaymentMethodAddLegacyBillingAddressView';

angular
  .module(moduleName, [angularTranslate, 'oui', ngTranslateAsyncLoader])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
