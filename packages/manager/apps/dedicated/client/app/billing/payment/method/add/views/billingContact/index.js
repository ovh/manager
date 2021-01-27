import angular from 'angular';

import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhContacts from '@ovh-ux/ng-ovh-contacts';

import component from './component';
import './index.scss';

const moduleName = 'ovhBillingPaymentMethodAddBillingContactView';

angular
  .module(moduleName, [
    angularTranslate,
    'oui',
    ngTranslateAsyncLoader,
    ngOvhContacts,
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(component.name, component);

export default moduleName;
