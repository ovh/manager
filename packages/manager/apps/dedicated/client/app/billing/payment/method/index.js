import angular from 'angular';

import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';

import addModule from './add';
import defaultModule from './default';
import deleteModule from './delete';
import editModule from './edit';

import routing from './routing';
import component from './component';

const moduleName = 'ovhBillingPaymentMethod';

angular
  .module(moduleName, [
    angularTranslate,
    'oui',
    ngTranslateAsyncLoader,
    ngOvhPaymentMethod,
    addModule,
    defaultModule,
    deleteModule,
    editModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
