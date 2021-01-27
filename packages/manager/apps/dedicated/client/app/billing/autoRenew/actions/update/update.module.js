import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import automatic from './automatic/automatic.module';
import form from './form/form.module';
import manualPayment from './manualPayment/manualPayment.module';
import noPaymentMean from './noPaymentMean/noPaymentMean.module';

import component from './update.component';
import routing from './update.routing';

const moduleName = 'ovhManagerBillingAutorenewUpdate';

angular
  .module(moduleName, [
    angularTranslate,
    automatic,
    form,
    ngAtInternet,
    ngOvhUtils,
    ngTranslateAsyncLoader,
    'oui',
    manualPayment,
    noPaymentMean,
    uiRouter,
  ])
  .config(routing)
  .component('billingAutorenewUpdate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
