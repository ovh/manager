import angular from 'angular';
import 'angular-translate';
import ovhManagerCore from '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';

import history from './history/history.module';
import payments from './payments/billing-payments.module';
import payAsYouGo from './payAsYouGo/billing-main-pay-as-you-go.module';

import routing from './billing-main.routes';

const moduleName = 'ovhManagerBillingMain';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerCore,
    'pascalprecht.translate',
    'ui.router',
    history,
    payments,
    payAsYouGo,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
