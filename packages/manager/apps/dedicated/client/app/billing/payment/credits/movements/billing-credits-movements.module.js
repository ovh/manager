import angular from 'angular';
import 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import routing from './billing-payment-credits-movements.routes';

const moduleName = 'ovhManagerBillingPaymentCreditsMovements';

angular
  .module(moduleName, [
    ngOvhUtils,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing);

export default moduleName;
