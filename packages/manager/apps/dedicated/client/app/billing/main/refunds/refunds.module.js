import angular from 'angular';
import 'angular-translate';
import uiRouter from '@uirouter/angularjs';
import '@ovh-ux/ui-kit';

import controller from './billing-refunds.controller';
import service from './billing-refunds.service';
import routing from './billing-payment-refunds.routes';

const moduleName = 'ovhManagerBillingRefunds';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', uiRouter])
  .config(routing)
  .controller('BillingRefundsController', controller)
  .service('BillingRefunds', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
