import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import routing from './billing-payments-request.routes';
import service from './billing-payments-request.service';

const moduleName = 'ovhManagerBillingMainPaymentsRequest';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    ngOvhUtils,
    uiRouter,
  ])
  .config(routing)
  .service('BillingPaymentsRequest', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
