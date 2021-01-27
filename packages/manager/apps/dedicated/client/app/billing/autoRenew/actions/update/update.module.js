import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import automatic from './automatic/automatic.module';
import form from './form/form.module';
import manualPayment from './manualPayment/manualPayment.module';
import noPaymentMean from './noPaymentMean/noPaymentMean.module';

import component from './update.component';
import routing from './update.routing';

const moduleName = 'ovhManagerBillingAutorenewUpdate';

angular
  .module(moduleName, [
    ngAtInternet,
    ngOvhUtils,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    automatic,
    form,
    manualPayment,
    noPaymentMean,
  ])
  .config(routing)
  .component('billingAutorenewUpdate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
