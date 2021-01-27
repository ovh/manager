import angular from 'angular';
import 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';

import routing from './billing-payments-request.routes';

const moduleName = 'ovhManagerBillingMainPaymentsRequest';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    ngOvhUtils,
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
