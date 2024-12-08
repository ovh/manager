import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import routing from './billing-payment-credits-movements.routes';

const moduleName = 'ovhManagerBillingPaymentCreditsMovements';

angular
  .module(moduleName, [
    angularTranslate,
    ngOvhUtils,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing);

export default moduleName;
