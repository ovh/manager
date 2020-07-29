import angular from 'angular';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './history.component';
import routing from './billing-main-history.routes';

import legacyHistory from './legacy/history.module';

const moduleName = 'ovhManagerDedicatedBillingHistory';

angular
  .module(moduleName, [
    legacyHistory,
    ngAtInternet,
    ngOvhApiWrappers,
    ngOvhPaymentMethod,
    'oui',
    'ovh-api-services',
    ovhManagerCore,
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(routing)
  .component('billingHistory', component)
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./postalMailOptions/translations */);

export default moduleName;
