import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import controller from './billing-corrective-invoices.controller';
import service from './billing-corrective-invoices.service';
import routing from './billing-corrective-invoices.routes';

const moduleName = 'ovhManagerBillingCorrectiveInvoices';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .controller('BillingCorrectiveInvoicesController', controller)
  .service('BillingCorrectiveInvoices', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
