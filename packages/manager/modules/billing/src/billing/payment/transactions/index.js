import angular from 'angular';

import routing from './billing-payment-transactions.routes';
import controller from './billing-payment-transactions.controller';

const moduleName = 'ovhBillingPaymentTransactions';

angular
  .module(moduleName, [])
  .config(routing)
  .controller('BillingPaymentTransactionsCtrl', controller)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
