import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ng-ovh-payment-method';

import addModule from './add';
import defaultModule from './default';
import deleteModule from './delete';
import editModule from './edit';

import routing from './routing';
import component from './component';

const moduleName = 'ovhBillingPaymentMethod';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngOvhPaymentMethod',
    addModule,
    defaultModule,
    deleteModule,
    editModule,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
