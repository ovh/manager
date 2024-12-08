import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import editPurchaseModule from './edit-purchase/edit-purchase.module';
import newPurchaseModule from './new-purchase/new-purchase.module';
import ordersPurchasesService from './billing-orders-purchases.service';
import ordersPurchasesComponent from './billing-orders-purchases.component';
import updatePurchaseStatusModule from './update-purchase-status/update-purchase-status.module';

import routing from './billing-orders-purchases.routing';

const moduleName = 'ovhManagerBillingOrdersPurchases';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngTranslateAsyncLoader,
    'oui',
    'ui.router',
    editPurchaseModule,
    newPurchaseModule,
    updatePurchaseStatusModule,
  ])
  .config(routing)
  .component('billingOrdersPurchasesComponent', ordersPurchasesComponent)
  .service('billingOrdersPurchasesService', ordersPurchasesService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
