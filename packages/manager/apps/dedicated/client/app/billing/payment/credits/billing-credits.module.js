import angular from 'angular';
import 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import movements from './movements/billing-credits-movements.module';

import routing from './billing-payment-credits.routes';
import service from './billing-credits.service';

const moduleName = 'ovhManagerBillingPaymentCredits';

angular
  .module(moduleName, [
    movements,
    ngOvhUtils,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .service('BillingCredits', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
